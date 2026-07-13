import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { authorizeCredentials } from "@/lib/credentials";

export const authOptions: NextAuthOptions = {
  // No adapter — using pure JWT strategy to avoid NextAuth v4 JWT+adapter session conflict
  // User upsert is handled manually in the signIn callback

  session: {
    strategy: "jwt",
  },

  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: authorizeCredentials,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: false,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: false,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, upsert the user in the database manually
      // (no PrismaAdapter — pure JWT strategy)
      if (account?.provider === "google" || account?.provider === "github") {
        if (!user.email) return false;
        try {
          await prisma.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name ?? undefined,
              image: user.image ?? undefined,
            },
            create: {
              email: user.email,
              name: user.name ?? null,
              image: user.image ?? null,
              role: "user",
            },
          });
        } catch (err) {
          console.error("[signIn] upsert failed:", err);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, trigger }) {
      // On first sign-in, user object is present — fetch DB record by email
      if (user) {
        try {
          if (user.email) {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email },
              select: { id: true, role: true },
            });
            if (dbUser) {
              token.sub = dbUser.id;
              token.role = dbUser.role;
            } else {
              token.role = "user";
            }
          } else {
            token.role = "user";
          }
        } catch (err) {
          console.error("[jwt] findUnique failed:", err);
          token.role = "user";
        }
      }

      // Refresh role only when explicitly triggered (e.g. after role change)
      else if (token.sub && trigger === "update") {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true },
          });
          if (dbUser) {
            token.role = dbUser.role;
          }
        } catch (err) {
          console.error("[jwt] role refresh failed:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // After sign in, check if URL contains a callbackUrl
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // If relative URL, prepend baseUrl
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Default to baseUrl
      return baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
