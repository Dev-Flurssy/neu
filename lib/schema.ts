import { z } from "zod";

export const credentialsSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .nonempty("Password is required"),
});
export type CredentialsSchema = z.infer<typeof credentialsSchema>;
