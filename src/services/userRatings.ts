"use server";

import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

export const createUserRating = async (
  userId: string,
  dragonsId: string,
  rating: { arena?: number; design?: number }
) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  if (!dragonsId) {
    throw new Error("dragonsId is required");
  }
  return await prisma.userRating.create({
    data: {
      arena: rating.arena,
      dragonsId,
      userId,
      design: rating.design,
    },
  });
};

export const updateRating = async (
  userId: string,
  dragonsId: string,
  rating: { arena?: number; design?: number }
) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  if (!dragonsId) {
    throw new Error("dragonsId is required");
  }
  return await prisma.userRating.update({
    where: {
      userId_dragonsId: {
        userId,
        dragonsId,
      },
    },
    data: {
      arena: rating.arena,
      design: rating.design,
    },
  });
};

export const deleteRating = async (userId: string, dragonsId: string) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  if (!dragonsId) {
    throw new Error("dragonsId is required");
  }
  return await prisma.userRating.delete({
    where: {
      userId_dragonsId: {
        userId,
        dragonsId,
      },
    },
  });
};

export const getUserRating = async (dragonsId: string) => {
  return await prisma.userRating.aggregate({
    where: {
      dragonsId,
    },
    _avg: {
      arena: true,
      design: true,
    },
    _count: {
      arena: true,
      design: true,
    },
  });
};

export const getAllUserRatings = unstable_cache(
  async () => {
    return await prisma.userRating.groupBy({
      by: ["dragonsId"],
      _avg: {
        arena: true,
        design: true,
      },
      _count: {
        arena: true,
        design: true,
      },
    });
  },
  ["getAllUserRatings"],
  {
    revalidate: 3600, // 1 hour
    tags: ["userRatings"],
  }
);

export const getUserRatingForADragon = async (
  userId: string,
  dragonsId: string
) => {
  return await prisma.userRating.findUnique({
    where: {
      userId_dragonsId: {
        userId,
        dragonsId,
      },
    },
  });
};
