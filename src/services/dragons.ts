import prisma from "@/lib/prisma";

export const fetchDragons = async () => {
  return await prisma.dragons.findMany();
};
