import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/pirateCOS/Admin";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as any })
  : null;

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { type, successUrl, cancelUrl } = body;

    if (!type || !["subscription", "topup"].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid checkout type" },
        { status: 400 },
      );
    }

    await dbConnect();
    const admin = await Admin.findById(user.tenantId);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Tenant profile not found" },
        { status: 404 },
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const isSubdomain = host.startsWith("cos.") || host === "cos.uipirate.com";
    const baseRedirect = isSubdomain
      ? `http://${host}`
      : `http://${host}/pirateCOS`;

    const finalSuccessUrl =
      successUrl || `${baseRedirect}/settings/billing?success=true`;
    const finalCancelUrl =
      cancelUrl || `${baseRedirect}/settings/billing?canceled=true`;

    // Developer-friendly Simulation Fallback if Stripe keys are not set
    if (!stripe) {
      console.warn(
        "⚠️ Stripe secret key is not set. Executing a sandbox simulated checkout flow...",
      );

      // Simulate database update immediately
      if (type === "subscription") {
        admin.plan = "pro";
        admin.subscriptionStatus = "active";
        admin.currentPeriodEnd = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ); // 30 days
        admin.creditsRemaining += 500; // Add standard Pro monthly credits
      } else {
        admin.creditsRemaining += 1000.0; // Standard 1,000 credit boost
      }

      await admin.save();

      const simulatedUrl =
        successUrl ||
        `${baseRedirect}/settings/billing?success=simulated-${type}`;

      return NextResponse.json({
        success: true,
        url: simulatedUrl,
        simulated: true,
      });
    }

    // --- LIVE STRIPE CHECKOUT FLOW ---
    let customerId = admin.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: admin.email,
        name: admin.name,
        metadata: {
          tenantId: String(admin._id),
        },
      });

      customerId = customer.id;
      admin.stripeCustomerId = customerId;
      await admin.save();
    }

    let session;

    if (type === "subscription") {
      const priceId =
        process.env.STRIPE_PRICE_ID_PRO || "price_1OvH1mC6J4Y5eQd1Placeholder"; // Fallback placeholder

      session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: finalSuccessUrl,
        cancel_url: finalCancelUrl,
        metadata: {
          tenantId: String(admin._id),
          type: "subscription",
        },
      });
    } else {
      const priceId =
        process.env.STRIPE_PRICE_ID_TOPUP ||
        "price_1OvH2eC6J4Y5eQd2Placeholder"; // Fallback placeholder

      session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "payment",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: finalSuccessUrl,
        cancel_url: finalCancelUrl,
        metadata: {
          tenantId: String(admin._id),
          type: "topup",
        },
      });
    }

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (err: any) {
    console.error("Checkout route error:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Checkout session generation failed",
      },
      { status: 500 },
    );
  }
}
