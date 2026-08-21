import { NextRequest, NextResponse } from "next/server";

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

    // Store in MongoDB if available
    const mongodbUri = process.env.MONGODB_URI;

    if (mongodbUri) {
      try {
        const { default: mongoose } = await import("mongoose");

        if (mongoose.connection.readyState !== 1) {
          await mongoose.connect(mongodbUri);
        }

        // Inline schema — avoids needing a separate model file
        const LeadSchema = new mongoose.Schema(
          {
            name: { type: String, required: true, trim: true },
            email: {
              type: String,
              required: true,
              trim: true,
              lowercase: true,
            },
            company: { type: String, trim: true },
            budget: { type: String },
            projectType: { type: String },
            message: { type: String, trim: true },
            source: { type: String, default: "contact-form" },
            createdAt: { type: Date, default: Date.now },
          },
          { timestamps: true },
        );

        // Use existing model or create a new one
        const Lead: any =
          mongoose.models.Lead || mongoose.model("Lead", LeadSchema);

        await Lead.create({
          name,
          email,
          company,
          budget,
          projectType,
          message,
          source: "contact-form",
        });
      } catch (dbError) {
        // Log but don't fail — still send the email notification
        console.error("Lead DB save failed:", dbError);
      }
    }

    // Send email notification via a simple fetch to an email service
    // (Uses environment variable for the notification email)
    const notificationEmail =
      process.env.NOTIFICATION_EMAIL || "vishal@uipirate.com";

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
