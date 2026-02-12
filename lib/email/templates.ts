/**
 * Base email template wrapper with NEU Notes branding
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
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container { 
          max-width: 600px; 
          margin: 40px auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: ${headerGradient}; 
          color: white; 
          padding: 40px 30px; 
          text-align: center;
        }
        .logo {
          width: 60px;
          height: 60px;
          margin: 0 auto 15px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .header h1 { 
          margin: 0; 
          font-size: 28px;
          font-weight: 700;
        }
        .header p {
          margin: 10px 0 0;
          opacity: 0.9;
          font-size: 14px;
        }
        .content { 
          padding: 40px 30px;
          background: white;
        }
        .content p {
          margin: 0 0 15px;
          font-size: 16px;
          color: #444;
        }
        .greeting {
          font-size: 18px;
          font-weight: 600;
          color: #222;
          margin-bottom: 20px;
        }
        .code-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 3px;
          border-radius: 12px;
          margin: 30px 0;
        }
        .code { 
          background: white;
          padding: 25px;
          text-align: center;
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #667eea;
          border-radius: 10px;
          font-family: 'Courier New', monospace;
        }
        .code-label {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-top: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
        }
        .info-box {
          background: #f0f7ff;
          border-left: 4px solid #667eea;
          padding: 15px 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .info-box p {
          margin: 0;
          font-size: 14px;
          color: #555;
        }
        .warning { 
          background: #fff3cd; 
          border-left: 4px solid #ffc107; 
          padding: 15px 20px; 
          margin: 25px 0; 
          border-radius: 4px;
        }
        .warning p {
          margin: 0;
          font-size: 14px;
          color: #856404;
        }
        .footer { 
          text-align: center; 
          padding: 30px;
          background: #f9f9f9;
          color: #666; 
          font-size: 13px;
          border-top: 1px solid #eee;
        }
        .footer p {
          margin: 5px 0;
        }
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
          .container {
            margin: 20px 10px;
          }
          .header, .content {
            padding: 30px 20px;
          }
          .code {
            font-size: 28px;
            letter-spacing: 6px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="white" fill-opacity="0.2"/>
              <path d="M12 12L20 20L28 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 20L20 28L28 20" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1>${title}</h1>
          <p>NEU Note Generator</p>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p><strong>NEU Note Generator</strong></p>
          <p>AI-Powered Academic Note Taking</p>
          <p style="margin-top: 15px;">© ${new Date().getFullYear()} NEU Notes. All rights reserved.</p>
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
  const displayName = name || "there";
  const content = `
    <p class="greeting">Hi ${displayName}! 👋</p>
    <p>Welcome to <strong>NEU Note Generator</strong>! We're excited to have you on board.</p>
    <p>Please use the verification code below to verify your email and start generating your notes:</p>
    
    <div class="code-container">
      <div class="code">${code}</div>
    </div>
    <p class="code-label">Your Verification Code</p>
    
    <div class="info-box">
      <p><strong>📝 What's Next?</strong></p>
      <p>Once verified, you'll be able to:</p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Generate AI-powered notes instantly</li>
        <li>Use our rich text editor with formatting</li>
        <li>Export notes as PDF, DOCX, or PPTX</li>
      </ul>
    </div>
    
    <p style="margin-top: 25px;"><strong>⏰ Important:</strong> This code will expire in <strong>10 minutes</strong>.</p>
    <p style="color: #666; font-size: 14px;">If you didn't create an account with NEU Note Generator, please ignore this email.</p>
  `;

  return createEmailTemplate(
    "Verify Your Email",
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    content
  );
}

/**
 * Password reset template
 */
export function generatePasswordResetEmail(code: string, name?: string): string {
  const displayName = name || "there";
  const content = `
    <p class="greeting">Hi ${displayName},</p>
    <p>We received a request to reset your password for your <strong>NEU Note Generator</strong> account.</p>
    <p>Please use the code below to reset your password and continue using the note generator:</p>
    
    <div class="code-container">
      <div class="code">${code}</div>
    </div>
    <p class="code-label">Your Password Reset Code</p>
    
    <div class="info-box">
      <p><strong>🔐 Security Tips:</strong></p>
      <ul style="margin: 10px 0; padding-left: 20px;">
        <li>Choose a strong, unique password</li>
        <li>Don't share your password with anyone</li>
        <li>Use a password manager for better security</li>
      </ul>
    </div>
    
    <p style="margin-top: 25px;"><strong>⏰ Important:</strong> This code will expire in <strong>10 minutes</strong>.</p>
    
    <div class="warning">
      <p><strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email and ensure your account is secure. Your password will not be changed unless you use this code.</p>
    </div>
    
    <p style="margin-top: 25px; color: #666; font-size: 14px;">Thank you for using NEU Note Generator!</p>
  `;

  return createEmailTemplate(
    "Reset Your Password",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    content
  );
}
