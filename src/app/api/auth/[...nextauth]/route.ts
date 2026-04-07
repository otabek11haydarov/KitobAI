import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Return dummy user for testing, normally you validate DB here
        if (credentials?.email && credentials?.password) {
          return { id: "1", name: "User", email: credentials.email };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 5 * 60 * 60, // 5 hours session limits
    updateAge: 60 * 60,   // update database limit hourly
  },
  jwt: {
    maxAge: 5 * 60 * 60, // Match token limit to 5 hours
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_super_secret_for_kitobai_123!!",
  pages: {
    signIn: '/', // Using original custom modal
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
