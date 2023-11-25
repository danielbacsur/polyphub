import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type Session } from "@/lib/types/auth";
import { prisma } from "@/lib/clients/prisma";

if (!process.env.AUTH_GOOGLE_ID) {
  throw new Error("AUTH_GOOGLE_ID not found.");
}

if (!process.env.AUTH_GOOGLE_SECRET) {
  throw new Error("AUTH_GOOGLE_SECRET not found.");
}

if (!process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
  throw new Error("NEXT_PUBLIC_ROOT_DOMAIN not found.");
}

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: VERCEL_DEPLOYMENT
          ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
          : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.user = user;

      return token;
    },
    session: async ({ session, token }) => {
      // @ts-expect-error
      session!.user!.id = token.user.id;

      return session;
    },
  },
};

export function getSession() {
  return getServerSession<NextAuthOptions, Session>(authOptions);
}
