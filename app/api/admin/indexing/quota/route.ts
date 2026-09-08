import { NextResponse } from "next/server";
import { requireApi } from "@/lib/auth/session";
import { getQuotaSummary } from "@/lib/indexing/quota";

export async function GET() {
  const guard = await requireApi("manage:indexing");
  if (!guard.ok) return guard.response;

  const quotas = await getQuotaSummary();
  return NextResponse.json({ quotas });
}
