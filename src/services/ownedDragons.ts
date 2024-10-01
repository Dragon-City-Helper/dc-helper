import prisma from "@/lib/prisma";
import { ownedDragons } from "@prisma/client";
import axios from "axios";

export const fetchOwned = async (userId: string) => {
  return await prisma.ownedDragons.findUniqueOrThrow({
    where: {
      userId,
    },
  });
};

export const setOwnedIds = async (userId: string, ownedIds: string[]) => {
  return await prisma.ownedDragons.update({
    where: {
      userId,
    },
    data: {
      dragons: ownedIds,
    },
  });
};

export const postOwned = async (userId: string, ownedIds: string[]) => {
  return axios.post<ownedDragons>(`/api/ownedDragons/${userId}`, {
    ownedIds,
  });
};

export const getOwned = async (userId: string) => {
  return axios.get<ownedDragons>(`/api/ownedDragons/${userId}`);
};
