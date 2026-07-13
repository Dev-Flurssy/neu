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
      // (since we're not using the PrismaAdapter)
      if (account?.provider === "google" || account?.provider === "github") {
        if (!user.email) return false;
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
      }
      return true;
    },

    async jwt({ token, user, trigger }) {
      // Attach user ID and role on first login (credentials) or after OAuth upsert
      if (user) {
        // For credentials, user.id is set by the authorize function
        // For OAuth, look up by email since user.id may not match DB
        const dbUser = user.email
          ? await prisma.user.findUnique({
              where: { email: user.email },
              select: { id: true, role: true },
            })
          : await prisma.user.findUnique({
              where: { id: user.id },
              select: { id: true, role: true },
            });
        token.sub = dbUser?.id ?? user.id;
        token.role = dbUser?.role ?? "user";
      }

      // Only refresh role from database when explicitly triggered (not on every request)
      else if (token.sub && trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
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
