import prisma from "@/lib/prisma";
import { Rarity, Rating } from "@prisma/client";
import axios from "axios";

export const fetchDragons = async (options?: { rarity: Rarity }) => {
  return await prisma.dragons.findMany({
    where: {
      rarity: options?.rarity,
    },
  });
};

export const fetchDragonsWithRatings = async (options?: { rarity: Rarity }) => {
  return await prisma.dragons.findMany({
    where: {
      rarity: options?.rarity,
    },
    include: {
      rating: true,
    },
  });
};

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export type dragonsWithRating = ThenArg<
  ReturnType<typeof fetchDragonsWithRatings>
>;

export const fetchDragonsWithRatingsNotNull = async (options?: {
  rarity: Rarity;
}) => {
  return await prisma.dragons.findMany({
    where: {
      rarity: options?.rarity,
      NOT: {
        rating: null,
      },
    },
    include: {
      rating: true,
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
  return axios.put<Rating>(`/api/dragons/${dragonsId}/rating`, {
    rating,
  });
};
