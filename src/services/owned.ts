"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { captureException } from "@sentry/nextjs";

export const fetchOwned = async () => {
  const session = await auth();
  if (session?.user.id) {
    try {
      const ownedDragons = await prisma.ownedDragons.findUnique({
        where: {
          userId: session.user.id,
        },
      });
      return ownedDragons?.dragons ?? [];
    } catch (err) {
      captureException(err, {
        level: "fatal",
        tags: {
          serverAction: "fetchOwned",
        },
      });
    }
  }
  return [];
};

export const setOwnedIds = async (ownedIds: string[]) => {
  const session = await auth();
  if (session?.user.id) {
    try {
      const ownedDragons = await prisma.ownedDragons.upsert({
        where: {
          userId: session.user.id,
        },
        create: {
          userId: session.user.id,
          dragons: ownedIds,
        },
        update: {
          dragons: ownedIds,
        },
      });
      return ownedDragons.dragons;
    } catch (err) {
      captureException(err, {
        level: "fatal",
        tags: {
          serverAction: "setOwnedIds",
        },
      });
      throw err;
    }
  } else {
    throw new Error("No User logged in");
  }
};
