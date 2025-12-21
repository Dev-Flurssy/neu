import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { credentialsSchema, CredentialsSchema } from "@/lib/schema";

export async function authorizeCredentials(credentials: unknown) {
  const validated = credentialsSchema.safeParse(credentials);
  if (!validated.success) {
    throw new Error("Invalid input: " + JSON.stringify(validated.error.issues));
  }

  const { email, password } = validated.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  return user;
}
