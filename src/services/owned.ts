import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/apiResponse";
import { ownedDragons } from "@prisma/client";
import axios from "axios";

export const fetchOwned = async (userId: string) => {
  return await prisma.ownedDragons.findUnique({
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

export const postOwned = async (ownedIds: string[]) => {
  const response = await axios.post<ApiResponse<ownedDragons["dragons"]>>(
    `/api/owned`,
    {
      ownedIds,
    },
  );
  return response.data;
};

export const getOwned = async () => {
  const response =
    await axios.get<ApiResponse<ownedDragons["dragons"]>>(`/api/owned`);
  return response.data;
};
