import prisma from "@/lib/prisma";
import { ownedDragons } from "@prisma/client";
import axios from "axios";

export const fetchOwned = async (id: string) => {
  return await prisma.ownedDragons.findUniqueOrThrow({
    where: {
      userId: id,
    },
  });
};

export const setOwnedIds = async (id: string, ownedIds: number[]) => {
  return await prisma.ownedDragons.update({
    where: {
      userId: id,
    },
    data: {
      ids: ownedIds,
    },
  });
};

export const postOwned = async (id: string, ownedIds: number[]) => {
  return axios.post<ownedDragons>(`/api/ownedDragons/${id}`, {
    ownedIds,
  });
};

export const getOwned = async (id: string) => {
  return axios.get<ownedDragons>(`/api/ownedDragons/${id}`);
};
