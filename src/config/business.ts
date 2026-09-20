/**
 * MIRA & CRUMB — CENTRAL BUSINESS CONFIGURATION
 * 
 * Centralized location for public business contact information, location details,
 * and WhatsApp routing. Note: This is a fictional portfolio/demo bakery project.
 * Private admin credentials and recipient emails are managed server-side.
 */

// WhatsApp configuration
// Use digits without '+' or special characters for wa.me URL generation
export const WHATSAPP_NUMBER_RAW = "917358357933";
export const WHATSAPP_NUMBER_DISPLAY = "+91 73583 57933";

// Direct WhatsApp helper link generator
export function getWhatsAppUrl(message: string): string {
  const cleanNumber = String(WHATSAPP_NUMBER_RAW).replace(/\D/g, '');
  const finalNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
  return `https://wa.me/${finalNumber}?text=${encodeURIComponent(message)}`;
}

// Business Details (Fictional Demo Bakery in Coimbatore, Tamil Nadu)
export const BUSINESS_NAME = "MIRA & CRUMB";
export const BUSINESS_TAGLINE = "Artisan Bakes & Pâtisserie";
export const BUSINESS_PHONE = "+91 73583 57933";
export const BUSINESS_EMAIL = "hello@miraandcrumb.in";
export const BUSINESS_ADDRESS = "Avinashi Road, Coimbatore, Tamil Nadu 641018, India";
export const INSTAGRAM_HANDLE = "@miraandcrumb";
export const INSTAGRAM_URL = "https://instagram.com/miraandcrumb";
export const FACEBOOK_URL = "https://facebook.com/miraandcrumb";
export const GOOGLE_MAPS_URL = "https://maps.google.com/?q=Avinashi+Road,+Coimbatore,+Tamil+Nadu+641018,+India";
export const GOOGLE_MAPS_EMBED_URL = "https://maps.google.com/maps?q=Avinashi+Road,+Coimbatore,+Tamil+Nadu+641018,+India&t=&z=14&ie=UTF8&iwloc=&output=embed";

export const OPENING_HOURS = [
  { days: "Tuesday — Friday", hours: "07:30 — 18:30" },
  { days: "Saturday", hours: "08:00 — 19:00" },
  { days: "Sunday", hours: "08:30 — 17:00" },
  { days: "Monday", hours: "Closed (Bake Lab & Prep)" },
];
