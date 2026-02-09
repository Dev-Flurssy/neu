# Email System

Modular email system using Resend for sending transactional emails.

## Structure

```
lib/email/
├── index.ts          # Main exports
├── config.ts         # Resend client & configuration
├── sender.ts         # Email sending logic
├── templates.ts      # HTML email templates
└── utils.ts          # Helper functions
```

## Usage

```typescript
import { sendEmail, generateVerificationEmail, generateCode } from "@/lib/email";

// Generate a code
const code = generateCode(); // "123456"

// Create email HTML
const html = generateVerificationEmail(code, "John");

// Send email
await sendEmail({
  to: "user@example.com",
  subject: "Verify Your Email",
  html,
});
```

## Configuration

### Environment Variables

Add to `.env.local`:
```env
RESEND_API_KEY=re_your_api_key_here
NODE_ENV=development  # or production
```

### Email Sender

Update `lib/email/config.ts`:
```typescript
export const EMAIL_CONFIG = {
  from: "NEU Notes <onboarding@resend.dev>", // Test domain
  // For production:
  // from: "NEU Notes <noreply@yourdomain.com>",
};
```

## Development Mode

In development (`NODE_ENV=development`):
- Emails are logged to console
- No actual emails are sent
- Verification codes are visible in terminal

## Production Mode

In production (`NODE_ENV=production`):
- Real emails sent via Resend
- Requires valid `RESEND_API_KEY`
- Uses configured sender email

## Templates

### Verification Email
```typescript
generateVerificationEmail(code: string, name?: string)
```

### Password Reset Email
```typescript
generatePasswordResetEmail(code: string, name?: string)
```

## Resend Setup

1. Sign up at https://resend.com
2. Get API key from dashboard
3. Add to `.env.local`
4. (Optional) Verify your domain for production

### Free Tier Limits
- 100 emails/day
- 3,000 emails/month
