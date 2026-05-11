import { Resend } from "resend";

// Initialize Resend client
export const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || "onboarding@resend.dev",
} as const;

export const isDevelopment = process.env.NODE_ENV === "development";
