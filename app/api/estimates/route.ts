import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Estimate from "@/models/Estimate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await dbConnect();

    const estimate = await Estimate.create(body);

    return NextResponse.json(
      { success: true, data: estimate },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Estimate API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required for updates" },
        { status: 400 }
      );
    }

    await dbConnect();
    const estimate = await Estimate.findByIdAndUpdate(id, data, { new: true });

    if (!estimate) {
      return NextResponse.json(
        { success: false, error: "Estimate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: estimate },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Estimate API PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const estimates = await Estimate.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: estimates },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Estimate API GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
