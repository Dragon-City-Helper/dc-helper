import prisma from "@/lib/prisma";
import { Prisma, Rarity, Rating } from "@prisma/client";
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

export const saveDragonRatings = async (dragonsId: string, rating: Rating) => {
  const { id, dragonsId: dragonId, ...rest } = rating;
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
