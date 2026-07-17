import { db } from "./db";
import { DEFAULT_SETTINGS, type Settings } from "./types";

const SETTINGS_KEY = "store_settings";

export async function getSettings(): Promise<Settings> {
  const rows = await db.setting.findMany();
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return {
    ...DEFAULT_SETTINGS,
    brandName: map.brandName || DEFAULT_SETTINGS.brandName,
    tagline: map.tagline || DEFAULT_SETTINGS.tagline,
    email: map.email || DEFAULT_SETTINGS.email,
    phone: map.phone || DEFAULT_SETTINGS.phone,
    address: map.address || DEFAULT_SETTINGS.address,
    facebook: map.facebook || DEFAULT_SETTINGS.facebook,
    twitter: map.twitter || DEFAULT_SETTINGS.twitter,
    instagram: map.instagram || DEFAULT_SETTINGS.instagram,
    linkedin: map.linkedin || DEFAULT_SETTINGS.linkedin,
    freeShippingThreshold: Number(map.freeShippingThreshold) || DEFAULT_SETTINGS.freeShippingThreshold,
    shippingFee: Number(map.shippingFee) || DEFAULT_SETTINGS.shippingFee,
    razorpayKeyId: map.razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
    gmailUser: map.gmailUser || process.env.GMAIL_USER || "",
    storeNotifyEmail: map.storeNotifyEmail || process.env.STORE_NOTIFY_EMAIL || "",
    announcementBar: map.announcementBar || DEFAULT_SETTINGS.announcementBar,
  };
}

export async function saveSettings(settings: Partial<Settings>): Promise<void> {
  for (const [key, value] of Object.entries(settings)) {
    const strValue = String(value);
    const existing = await db.setting.findUnique({ where: { key } });
    if (existing) {
      await db.setting.update({ where: { key }, data: { value: strValue } });
    } else {
      await db.setting.create({ data: { key, value: strValue } });
    }
  }
}
