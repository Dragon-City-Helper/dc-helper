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
      const ownedDragons = await prisma.ownedDragons.findMany({
        where: {
          userId: session.user.id,
        },
      });

      const dragonCount = ownedDragons?.length || 0;
      console.log(`fetchOwned: Fetched ${dragonCount} owned dragons`);

      return ownedDragons.map((d) => d.dragonsId) || [];
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

export const toggleOwned = async (dragonsId: string) => {
  console.log("toggleOwned: Start toggling owned status for dragon", dragonsId);

  const session = await auth();
  if (session?.user.id) {
    const userId = session.user.id;
    console.log(`toggleOwned: User authenticated with ID: ${userId}`);

    try {
      // Check if the dragon is already marked as owned
      const existingOwnedDragon = await prisma.ownedDragons.findUnique({
        where: {
          userId_dragonsId: {
            userId,
            dragonsId,
          },
        },
      });

      if (existingOwnedDragon) {
        // Dragon is already owned; remove it from the list
        await prisma.ownedDragons.delete({
          where: {
            id: existingOwnedDragon.id,
          },
        });
        console.log(`toggleOwned: Dragon ${dragonsId} removed from owned list`);
      } else {
        // Dragon is not owned; add it to the list
        await prisma.ownedDragons.create({
          data: {
            userId,
            dragonsId,
          },
        });
        console.log(`toggleOwned: Dragon ${dragonsId} added to owned list`);
      }

      return { success: true };
    } catch (err) {
      console.error(
        "toggleOwned: Error occurred while toggling owned dragon status",
        err,
      );
      captureException(err, {
        level: "fatal",
        tags: {
          serverAction: "toggleOwned",
        },
      });
      throw err;
    }
  } else {
    console.warn("toggleOwned: No authenticated user found - action aborted");
    throw new Error("No User logged in");
  }
};
