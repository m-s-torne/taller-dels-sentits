const requiredPublicEnvVars = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_OWNER_NAME',
  'NEXT_PUBLIC_OWNER_NIF',
  'NEXT_PUBLIC_BUSINESS_NAME',
  'NEXT_PUBLIC_BUSINESS_ADDRESS',
  'NEXT_PUBLIC_CONTACT_EMAIL',
  'NEXT_PUBLIC_CONTACT_PHONE',
  'NEXT_PUBLIC_CONTACT_PHONE_WA',
  'NEXT_PUBLIC_CONTACT_EMAIL_SCHOOLS',
  'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
] as const;

for (const key of requiredPublicEnvVars) {
  if (!process.env[key]) {
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
