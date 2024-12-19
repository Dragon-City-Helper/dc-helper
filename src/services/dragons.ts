import prisma from "@/lib/prisma";
import { IPerkSuggestion } from "@/types/perkSuggestions";
import { Rarity, Rating, Prisma, Elements } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

// Fetch functions

// Home Dragons - Sorted by rating, rarity and skin status
export const fetchHomeDragons = cache(
  unstable_cache(
    async () => {
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
          rating: true,
          image: true,
          thumbnail: true,
          originalDragonName: true,
          tags: true,
          perkSuggestions: true,
          releaseDate: true,
        },
      });
      // return dragons.sort((a, b) => {
      //   return (
      //     (b.releaseDate ? new Date(b.releaseDate) : new Date()).getTime() -
      //     (a.releaseDate ? new Date(a.releaseDate) : new Date()).getTime()
      //   );
      // });
      const rarityOrder = ["H", "M", "L", "E", "V", "R", "C"];
      return dragons.sort((a, b) => {
        if (a.releaseDate !== b.releaseDate) {
          return (
            (b.releaseDate ? new Date(b.releaseDate) : new Date()).getTime() -
            (a.releaseDate ? new Date(a.releaseDate) : new Date()).getTime()
          );
        }
        if (b.rating?.overall !== a.rating?.overall)
          return (b.rating?.overall ?? 0) - (a.rating?.overall ?? 0);
        if (b.rating?.score !== a.rating?.score)
          return (b.rating?.score ?? 0) - (a.rating?.score ?? 0);
        if (a.rarity !== b.rarity)
          return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
        return a.isSkin ? -1 : 1;
      });
    },
    ["homeDragons"],
    {
      revalidate: 21600, // 6 hours
      tags: ["homeDragons"],
    }
  )
);

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
        image: true,
        thumbnail: true,
        originalDragonName: true,
        tags: true,
        perkSuggestions: true,
        releaseDate: true,
      },
    });
  }
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
      image: true,
      thumbnail: true,
      originalDragonName: true,
      tags: true,
      perkSuggestions: true,
      releaseDate: true,
    },
  });
});

// Fetch unique tags
export const fetchUniqueTags = async () => {
  const tags = await prisma.dragons.findMany({ select: { tags: true } });
  return Array.from(
    new Set(tags.flatMap((dragon) => dragon.tags).filter(Boolean))
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
    (dragon) => dragon.id
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
    include: {
      rating: true,
      skills: {
        select: {
          id: true,
          name: true,
          skillType: true,
          description: true,
          cooldown: true,
        },
      },
      perkSuggestions: {
        select: {
          perk1: true,
          perk2: true,
        },
      },
    },
  });
});

export const fetchDragon = cache(async (id: string) => {
  return prisma.dragons.findUniqueOrThrow({
    where: { id },
    include: {
      rating: true,
      skills: {
        select: {
          id: true,
          name: true,
          skillType: true,
          description: true,
          cooldown: true,
        },
      },
      perkSuggestions: {
        select: {
          perk1: true,
          perk2: true,
        },
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
  data: Prisma.dragonsUpdateInput
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
  data: {
    tags: string[];
    rating: Rating;
    perkSuggestions: IPerkSuggestion[];
  }
) {
  const { dragonsId, ...createRating } = data.rating ?? {};
  const { id: ID, dragonsId: dID, ...updateRating } = data.rating ?? {};

  const body: Prisma.dragonsUpdateInput = {
    ...data,
    perkSuggestions: data.perkSuggestions
      ? {
          set: data.perkSuggestions.map((perkSuggestion) => ({
            perk1_perk2: {
              perk1: perkSuggestion.perk1,
              perk2: perkSuggestion.perk2,
            },
          })),
        }
      : undefined,
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
    const response = await fetch(`/api/dragons/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to update dragon with id ${id}`);
    }

    const data = await response.json();
    revalidateTag(`dragons/${id}`);
    revalidateTag(`tags`);
    return data;
  } catch (error) {
    console.error("Failed to update dragon data:", error);
    throw error;
  }
}

export async function getDragonById(id: string) {
  try {
    console.log(`Requesting dragon data for ID: ${id}`);

    const response = await fetch(`/api/dragons/${id}`, {
      next: {
        tags: [`dragons/${id}`],
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dragon data for ID: ${id}`);
    }

    const data = await response.json();

    console.log(`Successfully fetched dragon data for ID: ${id}`);
    return data;
  } catch (error: any) {
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error(
        `Error: ${error.response.status} - ${error.response.data.error}`
      );
      throw new Error(
        error.response.data.error || "Error fetching dragon data"
      );
    } else if (error.request) {
      // No response was received from the server
      console.error("Error: No response received from server");
      throw new Error("No response received from server");
    } else {
      // Something else went wrong
      console.error(`Error: ${error.message}`);
      throw new Error(error.message || "Unexpected error occurred");
    }
  }
}

// Types
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type BaseDragons = ThenArg<ReturnType<typeof fetchHomeDragons>>;
export type fullDragon = ThenArg<ReturnType<typeof fetchDragon>>;
