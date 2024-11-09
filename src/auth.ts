import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { type DefaultSession } from "next-auth";
import { Role } from "@prisma/client";
import { addDiscordRoleToUser } from "./utils/discord";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Discord],
  callbacks: {
    session({ session }) {
      return {
        expires: session.expires,
        user: {
          email: session.user.email,
          role: session.user.role,
          id: session.user.id,
          name: session.user.name,
        },
      };
    },
  },
  events: {
    signIn({ account, isNewUser }) {
      if (
        account?.provider === "discord" &&
        account?.providerAccountId &&
        isNewUser
      ) {
        addDiscordRoleToUser(account.providerAccountId);
        // TODO: future expand to beta testers
      }
    },
  },
});
