import { NextRequest, NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/settings";
import { getAdminFromRequest } from "@/lib/auth";
import { isEmailConfigured } from "@/lib/email";
import { isRazorpayConfigured } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({
    ...settings,
    emailConfigured: isEmailConfigured(),
    razorpayConfigured: isRazorpayConfigured(),
  });
}

export async function PUT(req: NextRequest) {
  const admin = await getAdminFromRequest();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  await saveSettings(body);
  const settings = await getSettings();
  return NextResponse.json({
    ...settings,
    emailConfigured: isEmailConfigured(),
    razorpayConfigured: isRazorpayConfigured(),
  });
}
