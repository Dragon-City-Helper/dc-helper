import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/apiResponse";
import { Rarity, Rating } from "@prisma/client";
import axios from "axios";
import { cache } from "react";

export const fetchHomeDragons = cache(async (options?: { rarity: Rarity }) => {
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
      maxSpeed: true,
      baseSpeed: true,
      rating: true,
      image: true,
      breedable: true,
    },
  });
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
