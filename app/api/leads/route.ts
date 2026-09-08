import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { stitchVisitorToLead } from "@/lib/analytics/stitch";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, budget, projectType, message } = body;

    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    const visitorId = req.cookies.get("up_vid")?.value;

    // Store in MongoDB if available
    if (process.env.MONGODB_URI) {
      try {
        await dbConnect();

        const lead = await Lead.create({
          name,
          email,
          company,
          budget,
          projectType,
          message,
          source: "contact-form",
          visitorId,
        });

        // Link this person's anonymous visit history to the new lead.
        await stitchVisitorToLead({
          visitorId,
          leadId: lead._id as never,
          email,
          path: req.headers.get("referer") || undefined,
          formName: "contact-form",
        });
      } catch (dbError) {
        // Log but don't fail — still return success to the visitor.
        console.error("Lead DB save failed:", dbError);
      }
    }

    // Log lead for server-side visibility
    console.log(
      `[NEW LEAD] ${name} | ${email} | ${company || "N/A"} | Budget: ${budget || "N/A"} | Type: ${projectType || "N/A"}`,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! We'll be in touch within 2 hours.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Lead API error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
