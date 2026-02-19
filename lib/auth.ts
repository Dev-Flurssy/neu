import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authorizeCredentials } from "@/lib/credentials";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

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
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Google OAuth users are automatically verified
      if (account?.provider === "google") {
        return true;
      }
      
      // For credentials login, check if email is verified
      if (account?.provider === "credentials") {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { emailVerified: true },
        });
        
        // Block sign in if email is not verified
        if (!dbUser?.emailVerified) {
          // Return false to prevent sign in
          return false;
        }
      }
      
      return true;
    },

    async jwt({ token, user, trigger }) {
      // Attach user ID and role on first login
      if (user) {
        token.sub = user.id;
        // Fetch role from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        token.role = dbUser?.role || 'user';
      }
      
      // Only refresh role from database when explicitly triggered (not on every request)
      // This improves performance significantly
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
