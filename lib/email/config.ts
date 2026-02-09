import { Resend } from "resend";

// Initialize Resend client
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
export const EMAIL_CONFIG = {
  from: "NEU Notes <onboarding@resend.dev>", // Using Resend's test domain
  // For production with your own domain, use:
  // from: "NEU Notes <noreply@yourdomain.com>",
} as const;

export const isDevelopment = process.env.NODE_ENV === "development";
