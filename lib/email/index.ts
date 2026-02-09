// Main email module - exports everything needed
export { sendEmail } from "./sender";
export type { EmailOptions } from "./sender";
export { generateVerificationEmail, generatePasswordResetEmail } from "./templates";
export { generateCode } from "./utils";
