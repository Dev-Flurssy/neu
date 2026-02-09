/**
 * Base email template wrapper
 */
function createEmailTemplate(
  title: string,
  headerGradient: string,
  content: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${headerGradient}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .code { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 8px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} NEU Notes. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Email verification template
 */
export function generateVerificationEmail(code: string, name?: string): string {
  const content = `
    <p>Hi ${name || "there"},</p>
    <p>Thank you for signing up! Please use the verification code below to complete your registration:</p>
    <div class="code">${code}</div>
    <p>This code will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return createEmailTemplate(
    "Email Verification",
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    content
  );
}

/**
 * Password reset template
 */
export function generatePasswordResetEmail(code: string, name?: string): string {
  const content = `
    <p>Hi ${name || "there"},</p>
    <p>We received a request to reset your password. Use the code below to proceed:</p>
    <div class="code">${code}</div>
    <p>This code will expire in 10 minutes.</p>
    <div class="warning">
      <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email and ensure your account is secure.
    </div>
  `;

  return createEmailTemplate(
    "Password Reset",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    content
  );
}
