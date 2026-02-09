// This file is kept for backward compatibility
// All email functionality has been moved to lib/email/ folder
export { sendEmail } from "./email/sender";
export type { EmailOptions } from "./email/sender";
export { generateVerificationEmail, generatePasswordResetEmail } from "./email/templates";
export { generateCode } from "./email/utils";

