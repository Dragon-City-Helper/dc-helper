import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/apiResponse";
import { Rarity, Rating } from "@prisma/client";
import axios from "axios";

import { cache } from "react";

export const fetchHomeDragons = cache(
  async (options?: { skip?: number; take?: number }) => {
    const dragons = await prisma.dragons.findMany({
      skip: options?.skip,
      take: options?.take,
      select: {
        id: true,
        name: true,
        familyName: true,
        elements: true,
        rarity: true,
        isSkin: true,
        hasAllSkins: true,
        isVip: true,
        hasSkills: true,
        skillType: true,
        maxSpeed: true,
        baseSpeed: true,
        rating: true,
        image: true,
        breedable: true,
        tags: true,
      },
    });

    const rarityOrder = ["H", "M", "L", "E", "V", "R", "C"];
    const sortedDragons = dragons.sort((a, b) => {
      // Sort by dragon.rating.overall (descending)
      if (b.rating?.overall !== a.rating?.overall) {
        return (b.rating?.overall ?? 0) - (a.rating?.overall ?? 0);
      }

      // Sort by dragon.rating.score (descending)
      if (b.rating?.score !== a.rating?.score) {
        return (b.rating?.score ?? 0) - (a.rating?.score ?? 0);
      }

      // Sort by dragon.isSkin (true values come first)
      if (a.isSkin !== b.isSkin) {
        return a.isSkin ? -1 : 1;
      }

      // Sort by dragon.rarity according to the specified order
      if (rarityOrder.indexOf(a.rarity) !== rarityOrder.indexOf(a.rarity)) {
        return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
      }

      return a.hasSkills ? -1 : 1;
    });

    return sortedDragons;
  },
);

export const fetchRateDragons = cache(async (options?: { rarity: Rarity }) => {
  return await prisma.dragons.findMany({
    where: {
      rarity: options?.rarity,
    },
    select: {
      id: true,
      name: true,
      familyName: true,
      elements: true,
      rarity: true,
      isSkin: true,
      hasAllSkins: true,
      isVip: true,
      hasSkills: true,
      skillType: true,
      rating: true,
      thumbnail: true,
    },
  });
});

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export type HomeDragons = ThenArg<ReturnType<typeof fetchHomeDragons>>;
export type RateDragons = ThenArg<ReturnType<typeof fetchRateDragons>>;

export const fetchRatedDragons = async (options?: { rarity: Rarity }) => {
  return await prisma.dragons.findMany({
    where: {
      rarity: options?.rarity,
      NOT: {
        rating: null,
      },
    },
    select: {
      id: true,
      name: true,
      familyName: true,
      elements: true,
      rarity: true,
      isSkin: true,
      hasAllSkins: true,
      isVip: true,
      hasSkills: true,
      skillType: true,
      rating: true,
      thumbnail: true,
    },
  });
};

export const fetchAllDragonIds = async () => {
  const dragonIds = await prisma.dragons.findMany({
    select: {
      id: true,
    },
  });
  return dragonIds.map((dragon) => dragon.id);
};

export const fetchAllSkinIds = async () => {
  const dragonIds = await prisma.dragons.findMany({
    where: {
      isSkin: true,
      hasAllSkins: false,
    },
    select: {
      id: true,
    },
  });
  return dragonIds.map((dragon) => dragon.id);
};

export const fetchSkinsForADragon = async (name: string) => {
  return await prisma.dragons.findMany({
    where: {
      name: {
        contains: name,
      },
      isSkin: true,
      hasAllSkins: false,
    },
    include: {
      rating: true,
      skills: true,
    },
  });
};

export const fetchDragon = async (id: string) => {
  return await prisma.dragons.findUniqueOrThrow({
    where: {
      id: id,
    },
    include: {
      rating: true,
      skills: {
        select: {
          id: true,
          name: true,
          skillType: true,
          description: true,
        },
      },
    },
  });
};
export type dragonWithSkillsAndRating = ThenArg<ReturnType<typeof fetchDragon>>;

export const saveDragonRatings = async (dragonsId: string, rating: Rating) => {
  const { id, dragonsId: _, ...rest } = rating;
  return await prisma.rating.upsert({
    where: {
      dragonsId: dragonsId,
      id: rating.id,
    },
    create: {
      ...rating,
      dragonsId: dragonsId,
    },
    update: {
      ...rest,
    },
  });
};

export const putRatings = async (dragonsId: string, rating: Rating) => {
  const response = await axios.put<ApiResponse<Rating>>(
    `/api/dragons/${dragonsId}/rating`,
    {
      rating,
    },
  );
  return response.data;
};
