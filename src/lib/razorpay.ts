import Razorpay from "razorpay";
import crypto from "crypto";

let instance: Razorpay | null = null;

export function getRazorpay(): Razorpay | null {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret || keyId.includes("1234567890abcdef")) {
    return null;
  }
  if (!instance) {
    instance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return instance;
}

export function isRazorpayConfigured() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return !!keyId && !!keySecret && !keyId.includes("1234567890abcdef");
}

export async function createRazorpayOrder(amount: number, receipt: string, notes?: Record<string, string>) {
  const rzp = getRazorpay();
  if (!rzp) return null;
  // amount in paise
  const order = await rzp.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt,
    notes,
  });
  return order;
}

export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret || keySecret.includes("1234567890abcdef")) return false;
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto.createHmac("sha256", keySecret).update(body).digest("hex");
  return expected === signature;
}
