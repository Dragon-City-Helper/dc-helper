import prisma from "@/lib/prisma";
import { Rarity, Rating, Prisma, Elements } from "@prisma/client";
import axios from "axios";
import { cache } from "react";

// Fetch functions

// Home Dragons - Sorted by rating, skin status, and rarity
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
      originalDragonName: true,
      tags: true,
    },
  });

  const rarityOrder = ["H", "M", "L", "E", "V", "R", "C"];
  return dragons.sort((a, b) => {
    if (b.rating?.overall !== a.rating?.overall)
      return (b.rating?.overall ?? 0) - (a.rating?.overall ?? 0);
    if (b.rating?.score !== a.rating?.score)
      return (b.rating?.score ?? 0) - (a.rating?.score ?? 0);
    if (a.isSkin !== b.isSkin) return a.isSkin ? -1 : 1;
    return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
  });
});

// Filtered dragons by rarity
export const fetchRateDragons = async (options?: { rarity: Rarity }) => {
  return prisma.dragons.findMany({
    where: { rarity: options?.rarity },
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

// Paginated & Filtered dragons with optional search filters
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

    const where: Prisma.dragonsWhereInput = {
      rarity,
      name: search ? { contains: search, mode: "insensitive" } : undefined,
      elements: element ? { has: element as Elements } : undefined,
      familyName,
      isSkin:
        skins === "skins" ? true : skins === "dragons" ? false : undefined,
    };

    return prisma.dragons.findMany({
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
  },
);

// Fetch dragons with non-null ratings
export const fetchRatedDragons = cache(async (options?: { rarity: Rarity }) => {
  return prisma.dragons.findMany({
    where: {
      rarity: options?.rarity,
      NOT: { rating: null },
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

// Fetch unique tags
export const fetchUniqueTags = async () => {
  const tags = await prisma.dragons.findMany({ select: { tags: true } });
  return Array.from(
    new Set(tags.flatMap((dragon) => dragon.tags).filter(Boolean)),
  );
};

// Fetch unique family names
export const fetchUniqueFamilyNames = async () => {
  const familyNames = await prisma.dragons.findMany({
    where: { familyName: { not: null } },
    select: { familyName: true },
    distinct: ["familyName"],
  });
  return familyNames.map((dragon) => dragon.familyName).filter(Boolean);
};

// Specific Dragon Fetches

export const fetchAllDragonIds = cache(async () => {
  return (await prisma.dragons.findMany({ select: { id: true } })).map(
    (dragon) => dragon.id,
  );
});

export const fetchAllSkinIds = async () => {
  return (
    await prisma.dragons.findMany({
      where: { isSkin: true, hasAllSkins: false },
      select: { id: true },
    })
  ).map((dragon) => dragon.id);
};

export const fetchSkinsForADragon = cache(async (name: string) => {
  return prisma.dragons.findMany({
    where: { originalDragonName: name, isSkin: true },
    include: { rating: true, skills: true },
  });
});

export const fetchDragon = cache(async (id: string) => {
  return prisma.dragons.findUniqueOrThrow({
    where: { id },
    include: {
      rating: true,
      skills: {
        select: { id: true, name: true, skillType: true, description: true },
      },
    },
  });
});

export const fetchDragonByName = cache(async (name: string) => {
  return prisma.dragons.findUniqueOrThrow({
    where: { name },
    include: {
      rating: true,
      skills: {
        select: { id: true, name: true, skillType: true, description: true },
      },
    },
  });
});

// Update Functions

export async function updateDragon(
  id: string,
  data: Prisma.dragonsUpdateInput,
) {
  try {
    return await prisma.dragons.update({
      where: { id },
      data,
      include: { rating: true },
    });
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
            where: { dragonsId: id },
            create: createRating,
            update: updateRating,
          },
        }
      : undefined,
  };
  try {
    const response = await axios.put(`/api/dragons/${id}`, body);
    return response.data;
  } catch (error) {
    console.error("Failed to update dragon data:", error);
    throw error;
  }
}

// Types
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type HomeDragons = ThenArg<ReturnType<typeof fetchHomeDragons>>;
export type RateDragons = ThenArg<ReturnType<typeof fetchRateDragons>>;
export type RateScreenDragons = ThenArg<
  ReturnType<typeof fetchRateScreenDragons>
>;
export type dragonWithSkillsAndRating = ThenArg<ReturnType<typeof fetchDragon>>;
