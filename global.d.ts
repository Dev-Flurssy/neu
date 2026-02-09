declare module ".*css";
declare module "bcrypt";
declare module "bcryptjs";
declare module "react-loading-skeleton/dist/skeleton.css";
declare module "document";
declare module "preview";

// Extend NextAuth types
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string;
  }
}
