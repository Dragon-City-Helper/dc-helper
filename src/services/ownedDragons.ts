import prisma from "@/lib/prisma";
import { ownedDragons } from "@prisma/client";
import axios from "axios";

export const seedUserId = "neel";

export const fetchOwned = async () => {
  return await prisma.ownedDragons.findUniqueOrThrow({
    where: {
      userId: seedUserId,
    },
  });
};

export const setOwnedIds = async (ownedIds: number[]) => {
  return await prisma.ownedDragons.update({
    where: {
      userId: seedUserId,
    },
    data: {
      ids: ownedIds,
    },
  });
};

export const postOwned = async (ownedIds: number[]) => {
  return axios.post(`/api/ownedDragons/${seedUserId}`, { ownedIds });
};

export const getOwned = async () => {
  return axios.get<ownedDragons>("/api/ownedDragons");
};
