"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { captureException } from "@sentry/nextjs";

export const fetchOwned = async () => {
  console.log(
    "fetchOwned: Start fetching owned dragons for authenticated user",
  );

  const session = await auth();
  if (session?.user.id) {
    console.log(`fetchOwned: User authenticated with ID: ${session.user.id}`);

    try {
      const ownedDragons = await prisma.ownedDragons.findUnique({
        where: {
          userId: session.user.id,
        },
      });

      const dragonCount = ownedDragons?.dragons.length || 0;
      console.log(`fetchOwned: Fetched ${dragonCount} owned dragons`);

      return ownedDragons?.dragons ?? [];
    } catch (err) {
      console.error(
        "fetchOwned: Error occurred while fetching owned dragons",
        err,
      );
      captureException(err, {
        level: "fatal",
        tags: {
          serverAction: "fetchOwned",
        },
      });
      return [];
    }
  } else {
    console.warn("fetchOwned: No authenticated user found");
    return [];
  }
};

export const setOwnedIds = async (ownedIds: string[]) => {
  console.log(
    "setOwnedIds: Start setting owned dragon IDs for authenticated user",
  );

  const session = await auth();
  if (session?.user.id) {
    console.log(`setOwnedIds: User authenticated with ID: ${session.user.id}`);

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

      console.log(
        `setOwnedIds: Successfully set ${ownedIds.length} owned dragon IDs`,
      );
      return ownedDragons.dragons;
    } catch (err) {
      console.error(
        "setOwnedIds: Error occurred while setting owned dragon IDs",
        err,
      );
      captureException(err, {
        level: "fatal",
        tags: {
          serverAction: "setOwnedIds",
        },
      });
      throw err;
    }
  } else {
    console.warn("setOwnedIds: No authenticated user found - action aborted");
    throw new Error("No User logged in");
  }
};
