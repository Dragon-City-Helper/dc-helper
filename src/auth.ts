import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { type DefaultSession } from "next-auth";
import { Role } from "@prisma/client";
import { addDiscordRoleToUser } from "./utils/discord";
import { sendGAEvent } from "@next/third-parties/google";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
      Contacts?: {
        discord: string | null;
        facebook: string | null;
        twitter: string | null;
        instagram: string | null;
        reddit: string | null;
      } | null;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Discord],
  callbacks: {
    async session({ session, user }) {
      // Get the user with their contacts
      const userWithContacts = await prisma.user.findUnique({
        where: { id: user.id },
        include: { Contacts: true },
      });

      // Cast user to any to access the role property
      const typedUser = user as any;

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: typedUser.role || 'USER',
          Contacts: userWithContacts?.Contacts ? {
            discord: userWithContacts.Contacts.discord,
            facebook: userWithContacts.Contacts.facebook,
            twitter: userWithContacts.Contacts.twitter,
            instagram: userWithContacts.Contacts.instagram,
            reddit: userWithContacts.Contacts.reddit || null,
          } : {
            discord: null,
            facebook: null,
            twitter: null,
            instagram: null,
            reddit: null,
          },
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
      if (isNewUser) {
        sendGAEvent("event", "sign_up", {
          method: account?.provider,
        });
      }
      sendGAEvent("event", "login", {
        method: account?.provider,
      });
    },
  },
});
