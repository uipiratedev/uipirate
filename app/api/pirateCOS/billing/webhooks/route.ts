import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import mongoose from "mongoose";

import dbConnect from "@/lib/mongodb";
import Admin from "@/models/pirateCOS/Admin";
import BillingEvent from "@/models/pirateCOS/BillingEvent";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as any }) : null;

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  let event: any;

  try {
    if (stripe && STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(bodyText, sig, STRIPE_WEBHOOK_SECRET);
    } else {
      // Sandbox fallback: parse directly for unverified sandbox emulation
      console.warn("⚠️ Webhook Signature Verification Bypassed. STRIPE_WEBHOOK_SECRET is not set.");
      event = JSON.parse(bodyText) as any;
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
  }

  await dbConnect();
  const type = event.type;
  console.log(`🔔 Stripe Webhook Received: ${type} [ID: ${event.id}]`);

  try {
    switch (type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const tenantId = session.metadata?.tenantId;
        const purchaseType = session.metadata?.type;

        if (!tenantId) {
          console.warn("❌ Webhook missing tenantId metadata. Skipping.");
          break;
        }

        const admin = await Admin.findById(tenantId);
        if (!admin) {
          console.warn(`❌ Tenant ${tenantId} not found in database.`);
          break;
        }

        if (purchaseType === "subscription") {
          const subId = session.subscription as string;
          admin.plan = "pro";
          admin.stripeSubscriptionId = subId;
          admin.subscriptionStatus = "active";
          admin.creditsRemaining += 500; // Provide Pro credit allowance
          
          if (stripe && subId) {
            const sub = (await stripe.subscriptions.retrieve(subId)) as any;
            admin.currentPeriodEnd = new Date(sub.current_period_end * 1000);
          } else {
            admin.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          }
          await admin.save();

          await BillingEvent.create({
            tenantId: admin._id,
            event: "subscription.created",
            stripeEventId: event.id,
            amount: session.amount_total ? session.amount_total / 100 : undefined,
            currency: session.currency || undefined,
            metadata: { stripeSubscriptionId: subId },
          });

          console.log(`🟢 Successfully activated Pro Subscription for tenant ${admin.email}`);
        } else if (purchaseType === "topup") {
          admin.creditsRemaining += 1000.0; // Credit package top-up
          await admin.save();

          await BillingEvent.create({
            tenantId: admin._id,
            event: "credit.topup",
            stripeEventId: event.id,
            amount: session.amount_total ? session.amount_total / 100 : undefined,
            currency: session.currency || undefined,
            metadata: { purchaseType: "credit_pack_1000" },
          });

          console.log(`🔋 Successfully credited 1,000 top-up credits to tenant ${admin.email}`);
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;
        const amountPaid = invoice.amount_paid / 100;

        const admin = await Admin.findOne({ stripeCustomerId: customerId });
        if (!admin) {
          console.warn(`❌ No tenant found with Stripe customer ID: ${customerId}`);
          break;
        }

        admin.subscriptionStatus = "active";
        admin.lifetimeValue += amountPaid;
        await admin.save();

        await BillingEvent.create({
          tenantId: admin._id,
          event: "invoice.paid",
          stripeEventId: event.id,
          amount: amountPaid,
          currency: invoice.currency,
          metadata: { stripeInvoiceId: invoice.id },
        });

        console.log(`✅ Invoice paid for ${admin.email}: $${amountPaid}. Total lifetime: $${admin.lifetimeValue}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const customerId = invoice.customer as string;

        const admin = await Admin.findOne({ stripeCustomerId: customerId });
        if (!admin) break;

        admin.subscriptionStatus = "past_due";
        await admin.save();

        await BillingEvent.create({
          tenantId: admin._id,
          event: "payment_failed",
          stripeEventId: event.id,
          amount: invoice.amount_due / 100,
          currency: invoice.currency,
          metadata: { stripeInvoiceId: invoice.id },
        });

        console.warn(`⚠️ Payment failed for ${admin.email}. Status set to past_due.`);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as any;
        const customerId = sub.customer as string;

        const admin = await Admin.findOne({ stripeCustomerId: customerId });
        if (!admin) break;

        admin.subscriptionStatus = sub.status as any;
        admin.currentPeriodEnd = new Date(sub.current_period_end * 1000);
        await admin.save();

        await BillingEvent.create({
          tenantId: admin._id,
          event: "subscription.updated",
          stripeEventId: event.id,
          metadata: { status: sub.status, stripeSubscriptionId: sub.id },
        });

        console.log(`🔄 Subscription updated for ${admin.email}. Status: ${sub.status}`);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const customerId = sub.customer as string;

        const admin = await Admin.findOne({ stripeCustomerId: customerId });
        if (!admin) break;

        admin.plan = "free";
        admin.subscriptionStatus = "canceled";
        admin.stripeSubscriptionId = undefined;
        await admin.save();

        await BillingEvent.create({
          tenantId: admin._id,
          event: "subscription.deleted",
          stripeEventId: event.id,
          metadata: { stripeSubscriptionId: sub.id },
        });

        console.log(`🛑 Subscription canceled for ${admin.email}. Plan downgraded to Free.`);
        break;
      }

      default:
        console.log(`ℹ️ Unhandled Stripe Webhook Event: ${type}`);
    }

    return NextResponse.json({ success: true, received: true });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
