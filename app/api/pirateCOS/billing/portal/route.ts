import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { verifyAuth } from "@/lib/pirateCOS/auth";
import { checkRole } from "@/lib/pirateCOS/require-role";
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

    const denied = checkRole(user, ["org-admin"]);
    if (denied) return denied;

    await dbConnect();
    const admin = await Admin.findById(user.tenantId);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Tenant profile not found" },
        { status: 404 },
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const allowedHosts = ["cos.uipirate.com", "uipirate.com"];
    if (process.env.NODE_ENV === "production" && !allowedHosts.includes(host.split(":")[0])) {
      return NextResponse.json(
        { success: false, error: "Invalid Host header" },
        { status: 400 }
      );
    }

    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const isSubdomain = host.startsWith("cos.") || host === "cos.uipirate.com";
    const baseRedirect = isSubdomain
      ? `${protocol}://${host}`
      : `${protocol}://${host}/pirateCOS`;
    const returnUrl = `${baseRedirect}/settings/billing`;

    // Developer simulation bypass
    if (!stripe || !admin.stripeCustomerId) {
      console.warn(
        "⚠️ Stripe secret key is not set or stripeCustomerId is missing. Simulating Portal bypass...",
      );

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

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create portal session",
      },
      { status: 500 },
    );
  }
}
