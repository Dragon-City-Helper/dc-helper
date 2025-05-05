"use server";

import { prisma } from "@/lib/prisma";
import { Elements, HandleEssences, Rarity, Trade } from "@prisma/client";

// list page
export async function getTrades() {
  const trades = await prisma.trade.findMany({
    where: { isDeleted: false, isVisible: true },
    include: {
      lookingFor: {
        include: {
          dragon: {
            select: {
              id: true,
              name: true,
              rarity: true,
              thumbnail: true,
              familyName: true,
              isSkin: true,
              isVip: true,
              hasSkills: true,
              hasAllSkins: true,
              skillType: true,
            },
          },
        },
      },
      canGive: {
        include: {
          dragon: {
            select: {
              id: true,
              name: true,
              rarity: true,
              thumbnail: true,
              familyName: true,
              isSkin: true,
              isVip: true,
              hasSkills: true,
              hasAllSkins: true,
              skillType: true,
            },
          },
        },
      },
    },
  });
  return trades;
}

export async function getTradesByUserId(userId: string) {
  const trades = await prisma.trade.findMany({
    where: { userId: { not: userId }, isDeleted: false, isVisible: true },
    include: {
      lookingFor: {
        include: {
          dragon: {
            select: {
              id: true,
              name: true,
              rarity: true,
              thumbnail: true,
              familyName: true,
              isSkin: true,
              isVip: true,
              hasSkills: true,
              hasAllSkins: true,
              skillType: true,
            },
          },
        },
      },
      canGive: {
        include: {
          dragon: {
            select: {
              id: true,
              name: true,
              rarity: true,
              thumbnail: true,
              familyName: true,
              isSkin: true,
              isVip: true,
              hasSkills: true,
              hasAllSkins: true,
              skillType: true,
            },
          },
        },
      },
    },
  });
  return trades;
}

export async function getTradesByFilters(filters: TradeFilters) {
  const trades = await prisma.trade.findMany({
    where: {
      isDeleted: false,
      isVisible: true,
      lookingFor: {
        dragon: {
          id: { in: filters.lookingForDragonIds ?? [] },
          familyName: filters.familyName ?? undefined,
          rarity: filters.rarity ?? undefined,
          elements: filters.element ? { has: filters.element } : undefined,
        },
      },
      canGive: {
        some: {
          dragonsId: { in: filters.canGiveDragonIds ?? [] },
        },
      },
      isSponsored: filters.isSponsored ?? undefined,
    },
    include: {
      lookingFor: {
        include: {
          dragon: {
            select: {
              id: true,
              name: true,
              rarity: true,
              thumbnail: true,
              familyName: true,
              isSkin: true,
              isVip: true,
              hasSkills: true,
              hasAllSkins: true,
              skillType: true,
            },
          },
        },
      },
      canGive: {
        include: {
          dragon: {
            select: {
              id: true,
              name: true,
              rarity: true,
              thumbnail: true,
              familyName: true,
              isSkin: true,
              isVip: true,
              hasSkills: true,
              hasAllSkins: true,
              skillType: true,
            },
          },
        },
      },
    },
  });
  return trades;
}

export async function getTradesForUserIdAndFilters(
  userId: string,
  filters: TradeFilters
) {
  const trades = await prisma.trade.findMany({
    where: {
      userId: { not: userId },
      isDeleted: false,
      isVisible: true,
      lookingFor: {
        dragon: {
          id: { in: filters.lookingForDragonIds ?? [] },
          familyName: filters.familyName ?? undefined,
          rarity: filters.rarity ?? undefined,
          elements: filters.element ? { has: filters.element } : undefined,
        },
      },
      canGive: {
        some: {
          dragonsId: { in: filters.canGiveDragonIds ?? [] },
        },
      },
      isSponsored: filters.isSponsored ?? undefined,
    },
    include: {
      lookingFor: {
        include: {
          dragon: {
            select: {
              id: true,
              name: true,
              rarity: true,
              thumbnail: true,
              familyName: true,
              isSkin: true,
              isVip: true,
              hasSkills: true,
              hasAllSkins: true,
              skillType: true,
            },
          },
        },
      },
      canGive: {
        include: {
          dragon: {
            select: {
              id: true,
              name: true,
              rarity: true,
              thumbnail: true,
              familyName: true,
              isSkin: true,
              isVip: true,
              hasSkills: true,
              hasAllSkins: true,
              skillType: true,
            },
          },
        },
      },
    },
  });
  return trades;
}

export async function createTradeRequest(tradeId: string, userId: string) {
  const newRequest = await prisma.request.create({
    data: { tradeId, userId },
  });
  return newRequest;
}

// management page
export async function getTradeByUserId(userId: string) {
  const trades = await prisma.trade.findMany({
    where: { userId, isDeleted: false },
    include: {
      lookingFor: {
        include: {
          dragon: {
            select: {
              id: true,
              name: true,
              rarity: true,
              thumbnail: true,
              familyName: true,
              isSkin: true,
              isVip: true,
              hasSkills: true,
              hasAllSkins: true,
              skillType: true,
            },
          },
        },
      },
      canGive: {
        include: {
          dragon: {
            select: {
              id: true,
              name: true,
              rarity: true,
              thumbnail: true,
              familyName: true,
              isSkin: true,
              isVip: true,
              hasSkills: true,
              hasAllSkins: true,
              skillType: true,
            },
          },
        },
      },
    },
  });
  return trades;
}
export interface CreateTradeInput {
  lookingFor: {
    dragonId: string;
    orbs: number;
  };
  canGiveDragons: {
    dragonId: string;
    orbs: number;
    ratioLeft: number;
    ratioRight: number;
  }[];
  isVisible: boolean;
  isDeleted: boolean;
  isSponsored: boolean;
  handleEssences: HandleEssences;
}
export async function createTrade(userId: string, trade: CreateTradeInput) {
  const newTrade = await prisma.trade.create({
    data: {
      lookingFor: {
        create: {
          dragon: {
            connect: {
              id: trade.lookingFor.dragonId,
            },
          },
          orbCount: trade.lookingFor.orbs,
        },
      },
      canGive: {
        createMany: {
          data: trade.canGiveDragons.map((canGive) => ({
            dragonsId: canGive.dragonId,
            orbCount: canGive.orbs,
            ratioLeft: canGive.ratioLeft,
            ratioRight: canGive.ratioRight,
          })),
        },
      },
      isVisible: trade.isVisible,
      isDeleted: trade.isDeleted,
      isSponsored: trade.isSponsored,
      handleEssences: trade.handleEssences,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return newTrade;
}

export async function updateTrade(id: string, trade: Trade) {
  const updatedTrade = await prisma.trade.update({
    where: { id },
    data: trade,
  });
  return updatedTrade;
}

export async function deleteTrade(id: string) {
  const deletedTrade = await prisma.trade.update({
    where: { id },
    data: { isDeleted: true },
  });
  return deletedTrade;
}

export async function toggleTradeVisibility(id: string, isVisible: boolean) {
  const updatedTrade = await prisma.trade.update({
    where: { id },
    data: { isVisible },
  });
  return updatedTrade;
}

export async function cancelTradeRequest(tradeId: string, userId: string) {
  const deletedRequest = await prisma.request.delete({
    where: { tradeId_userId: { tradeId, userId } },
  });
  return deletedRequest;
}

export async function createTradeApi(tradeData: {
  lookingForDragon: {
    dragonId: string;
    orbs: number;
  };
  canGiveDragons: {
    dragonId: string;
    orbs: number;
    ratioLeft: number;
    ratioRight: number;
  }[];
}) {
  const response = await fetch("/api/trades", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tradeData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create trade");
  }

  return response.json();
}

// dragon page
export async function getTradeByLookingForDragonId(dragonId: string) {
  const trades = await prisma.trade.findMany({
    where: {
      lookingFor: {
        dragon: {
          id: dragonId,
        },
      },
    },
    include: {
      lookingFor: {
        include: {
          dragon: {
            select: {
              id: true,
              name: true,
              rarity: true,
              thumbnail: true,
              familyName: true,
              isSkin: true,
              isVip: true,
              hasSkills: true,
              hasAllSkins: true,
              skillType: true,
            },
          },
        },
      },
      canGive: {
        include: {
          dragon: {
            select: {
              id: true,
              name: true,
              rarity: true,
              thumbnail: true,
              familyName: true,
              isSkin: true,
              isVip: true,
              hasSkills: true,
              hasAllSkins: true,
              skillType: true,
            },
          },
        },
      },
    },
  });
  return trades;
}

//types
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type UITrades = ThenArg<ReturnType<typeof getTrades>>;
export interface TradeFilters {
  lookingForDragonIds?: string[];
  canGiveDragonIds?: string[];
  familyName?: string;
  rarity?: Rarity;
  element?: Elements;
  isSponsored?: boolean;
}
