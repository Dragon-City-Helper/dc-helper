import prisma from "@/lib/prisma";
import { Rarity, Rating, Prisma, dragons } from "@prisma/client";
import axios from "axios";

import { cache } from "react";

export const fetchHomeDragons = cache(async () => {
  const dragons = await prisma.dragons.findMany({
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
});

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

export const fetchRateScreenDragons = cache(
  async (options: {
    rarity: Rarity;
    skip?: number;
    take?: number;
    search?: string;
    element?: string;
    familyName?: string;
    skins?: string;
  }) => {
    const {
      rarity,
      skip = 0,
      take = 50,
      search,
      element,
      familyName,
      skins,
    } = options;

    const where: any = {
      rarity,
    };

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (element) {
      where.elements = {
        has: element,
      };
    }

    if (familyName) {
      where.familyName = familyName;
    }

    if (skins === "skins") {
      where.isSkin = true;
    } else if (skins === "dragons") {
      where.isSkin = false;
    }

    const dragons = await prisma.dragons.findMany({
      where,
      skip,
      take,
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
        tags: true,
      },
    });

    return dragons;
  },
);

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export type HomeDragons = ThenArg<ReturnType<typeof fetchHomeDragons>>;
export type RateDragons = ThenArg<ReturnType<typeof fetchRateDragons>>;
export type RateScreenDragons = ThenArg<
  ReturnType<typeof fetchRateScreenDragons>
>;

export const fetchRatedDragons = cache(async (options?: { rarity: Rarity }) => {
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
});

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
      id,
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

export const fetchDragonByName = async (name: string) => {
  return await prisma.dragons.findUniqueOrThrow({
    where: {
      name,
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

export const fetchUniqueTags = cache(async () => {
  const tags = await prisma.dragons.findMany({
    select: {
      tags: true,
    },
  });

  // Flatten the tags arrays and get unique values
  const uniqueTags = Array.from(
    new Set(tags.flatMap((dragon) => dragon.tags)),
  ).filter((tag): tag is string => tag !== null && tag.trim() !== "");

  return uniqueTags;
});

export const fetchUniqueFamilyNames = cache(async () => {
  const familyNames = await prisma.dragons.findMany({
    where: {
      familyName: {
        not: null,
      },
    },
    select: {
      familyName: true,
    },
    distinct: ["familyName"],
  });

  // Extract family names and ensure they are non-null
  const uniqueFamilyNames = familyNames
    .map((dragon) => dragon.familyName)
    .filter((name): name is string => name !== null);

  return uniqueFamilyNames;
});

export async function updateDragon(
  id: string,
  data: Prisma.dragonsUpdateInput,
) {
  try {
    const updatedDragon = await prisma.dragons.update({
      where: { id },
      data,
      include: {
        rating: true,
      },
    });
    return updatedDragon;
  } catch (error) {
    console.error("Failed to update dragon:", error);
    throw error;
  }
}

export async function putDragonData(
  id: string,
  data: { tags: string[]; rating: Rating },
) {
  const { dragonsId, ...createRating } = data.rating ?? {};
  const { id: ID, dragonsId: dID, ...updateRating } = data.rating ?? {};

  const body: Prisma.dragonsUpdateInput = {
    ...data,
    rating: data.rating
      ? {
          upsert: {
            where: {
              dragonsId: id,
            },
            create: createRating,
            update: updateRating,
          },
        }
      : undefined,
  };
  try {
    const response = await axios.put<RateScreenDragons[number]>(
      `/api/dragons/${id}`,
      body,
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update dragon data:", error);
    throw error;
  }
}
