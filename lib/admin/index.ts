/**
 * Admin utility functions
 * Centralized exports for admin management
 */

export { createAdmin } from "./create-admin";
export type { CreateAdminInput, CreateAdminResult } from "./create-admin";

export { promoteUserToAdmin, demoteAdminToUser } from "./promote-user";
export type { PromoteUserResult } from "./promote-user";
