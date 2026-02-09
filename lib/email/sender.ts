import { resend, EMAIL_CONFIG, isDevelopment } from "./config";
import { logEmailToConsole } from "./utils";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send email using Resend
 */
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<{ success: boolean }> {
  // In development, log to console instead of sending
  if (isDevelopment) {
    logEmailToConsole(to, subject, html);
    return { success: true };
  }

  // In production, send via Resend
  try {
    await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}
