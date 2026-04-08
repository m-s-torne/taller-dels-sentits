const resolvedEnv = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_OWNER_NAME: process.env.NEXT_PUBLIC_OWNER_NAME,
  NEXT_PUBLIC_OWNER_NIF: process.env.NEXT_PUBLIC_OWNER_NIF,
  NEXT_PUBLIC_BUSINESS_NAME: process.env.NEXT_PUBLIC_BUSINESS_NAME,
  NEXT_PUBLIC_BUSINESS_ADDRESS: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS,
  NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  NEXT_PUBLIC_CONTACT_PHONE: process.env.NEXT_PUBLIC_CONTACT_PHONE,
  NEXT_PUBLIC_CONTACT_PHONE_WA: process.env.NEXT_PUBLIC_CONTACT_PHONE_WA,
  NEXT_PUBLIC_CONTACT_EMAIL_SCHOOLS: process.env.NEXT_PUBLIC_CONTACT_EMAIL_SCHOOLS,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
};

for (const [key, value] of Object.entries(resolvedEnv)) {
  if (!value) {
    throw new Error(
      `[siteConfig] Missing required environment variable: ${key}. ` +
      `Check your .env.local (development) or Vercel environment settings (production).`
    );
  }
}

export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
  ownerName: process.env.NEXT_PUBLIC_OWNER_NAME!,
  ownerNif: process.env.NEXT_PUBLIC_OWNER_NIF!,
  businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME!,
  businessAddress: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS!,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL!,
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE!,
  contactPhoneWa: process.env.NEXT_PUBLIC_CONTACT_PHONE_WA!,
  contactEmailSchools: process.env.NEXT_PUBLIC_CONTACT_EMAIL_SCHOOLS!,
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
};
