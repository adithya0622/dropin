import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { authenticateUser, getOrCreateGoogleUser } from "./email-auth";

// Get NEXTAUTH_SECRET from environment or use a default
const getSecret = () => {
  return (
    process.env.NEXTAUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "auristra26-universal-auth-2026-super-secret-key"
  );
};

// Get NEXTAUTH_URL - support both Vercel and localhost
const getNextAuthUrl = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }
  return "http://localhost:3000";
};

export const authOptions: NextAuthOptions = {
  // Specify which provider to use
  providers: [
    // Universal Google OAuth - No restrictions
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "demo-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo-google-client-secret",
      allowDangerousEmailAccountLinking: true,
    }),

    // Email/Password Authentication
    CredentialsProvider({
      id: "email-login",
      name: "Email Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) {
            throw new Error("Email and password required");
          }

          // Authenticate user with stored credentials
          const user = authenticateUser(credentials.email, credentials.password);
          if (!user) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: undefined,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),

    // Email/Password Signup Provider
    CredentialsProvider({
      id: "email-signup",
      name: "Email Signup",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@gmail.com" },
        password: { label: "Password", type: "password" },
        name: { label: "Full Name", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password || !credentials?.name) {
            throw new Error("Email, password, and name required");
          }

          const { createUser } = await import("./email-auth");

          // Create new user
          const newUser = createUser(credentials.email, credentials.password, credentials.name);

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            image: undefined,
          };
        } catch (error) {
          console.error("Signup error:", error);
          return null;
        }
      },
    }),
  ],

  // Page redirects
  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    // Handle Google OAuth user
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google" && user.email && user.name) {
          const { getOrCreateGoogleUser } = await import("./email-auth");
          const dbUser = getOrCreateGoogleUser(user.email, user.name, user.image);
          user.id = dbUser.id;
        }
        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },

    // Add user data to JWT token
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id || token.sub;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },

    // Add user data to session from JWT token
    async session({ session, token, user }) {
      if (session && session.user) {
        session.user.id = token.id || token.sub || "";
        session.user.email = token.email || "";
        session.user.name = token.name || "";
        session.user.image = token.image || "";
      }
      return session;
    },

    // Handle redirect after sign in
    async redirect({ url, baseUrl }) {
      // Allow callback URLs on the same origin
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow tenants on the same host
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/dashboard";
    },
  },

  // Session configuration - Extended for persistent login
  session: {
    strategy: "jwt",
    maxAge: 90 * 24 * 60 * 60, // 90 days - stay logged in longer
    updateAge: 7 * 24 * 60 * 60, // Update every 7 days
  },

  // JWT configuration - Extended expiration
  jwt: {
    secret: getSecret(),
    maxAge: 90 * 24 * 60 * 60, // 90 days
    encryption: true,
  },

  // NextAuth secret
  secret: getSecret(),

  // Trust the host (required for Vercel)
  trustHost: true,

  // Debug mode for development
  debug: process.env.NODE_ENV === "development",
};
