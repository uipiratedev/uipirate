import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/pirateCOS/Admin";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" as any }) : null;

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const admin = await Admin.findById(user.tenantId);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Tenant profile not found" }, { status: 404 });
    }

    const host = req.headers.get("host") || "localhost:3000";
    const isSubdomain = host.startsWith("cos.") || host === "cos.uipirate.com";
    const baseRedirect = isSubdomain ? `http://${host}` : `http://${host}/pirateCOS`;
    const returnUrl = `${baseRedirect}/settings/billing`;

    // Developer simulation bypass
    if (!stripe || !admin.stripeCustomerId) {
      console.warn("⚠️ Stripe secret key is not set or stripeCustomerId is missing. Simulating Portal bypass...");
      return NextResponse.json({
        success: true,
        url: `${returnUrl}?portal=simulated`,
        simulated: true,
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: admin.stripeCustomerId,
      return_url: returnUrl,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
    });

  } catch (err: any) {
    console.error("Portal route error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to create portal session" }, { status: 500 });
  }
}
