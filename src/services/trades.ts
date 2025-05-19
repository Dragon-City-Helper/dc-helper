"use server";

import { prisma } from "@/lib/prisma";
import { Elements, HandleEssences, Rarity, Trade } from "@prisma/client";

// list page
export async function getTradeById(id: string) {
  const trade = await prisma.trade.findUnique({
    where: { id, isDeleted: false },
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
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return trade;
}

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

// Returns all trades except those posted by the specified user
export async function getTradesExcludingUser(userId: string) {
  const trades = await prisma.trade.findMany({
    where: {
      isDeleted: false,
      isVisible: true,
      userId: { not: userId }
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

// Returns all trades posted by the specified user
export async function getTradesByUser(userId: string, mode: 'active' | 'archived' = 'active') {
  // Define the query conditions based on mode
  const whereCondition = {
    userId: userId,
    ...(mode === 'active' 
      ? { isDeleted: false, isVisible: true } 
      : { OR: [{ isDeleted: true }, { isVisible: false }] })
  };
  
  const trades = await prisma.trade.findMany({
    where: whereCondition,
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
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
  
  // Map the trades to include the userId at the top level for easier access
  return trades.map(trade => ({
    ...trade,
    userId: trade.user.id,
    user: {
      id: trade.user.id,
      name: trade.user.name,
      image: trade.user.image,
    },
  }));
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

/**
 * Update a trade's properties (visibility, sponsored status, etc.)
 * @param tradeId The ID of the trade to update
 * @param userId The ID of the user attempting to update the trade
 * @param updateData The data to update on the trade
 * @returns The updated trade record or null if the trade doesn't exist or user doesn't have permission
 */
export async function updateTrade(
  tradeId: string, 
  userId: string, 
  updateData: Partial<CreateTradeInput> | {
    isVisible?: boolean;
    isDeleted?: boolean;
    isSponsored?: boolean;
    handleEssences?: HandleEssences;
  }
) {
  // First verify that the trade exists and belongs to the user
  const existingTrade = await prisma.trade.findFirst({
    where: {
      id: tradeId,
      userId: userId,
    },
    include: {
      lookingFor: true,
      canGive: true,
    }
  });

  if (!existingTrade) {
    return null;
  }

  // Prepare the base update data
  const baseUpdateData = {
    ...(updateData.isVisible !== undefined && { isVisible: updateData.isVisible }),
    ...(updateData.isDeleted !== undefined && { isDeleted: updateData.isDeleted }),
    ...(updateData.isSponsored !== undefined && { isSponsored: updateData.isSponsored }),
    ...(updateData.handleEssences !== undefined && { handleEssences: updateData.handleEssences }),
  };

  // Check if we're doing a full trade update with lookingFor and canGive
  const fullUpdateData = updateData as CreateTradeInput;
  const isFullUpdate = fullUpdateData.lookingFor && fullUpdateData.canGiveDragons;

  // Update the trade with the provided data
  const updatedTrade = await prisma.trade.update({
    where: { id: tradeId },
    data: {
      ...baseUpdateData,
      // If full update, update lookingFor relationship
      ...(isFullUpdate && {
        lookingFor: {
          update: {
            where: {
              id: existingTrade.lookingFor.id
            },
            data: {
              dragon: {
                connect: {
                  id: fullUpdateData.lookingFor.dragonId,
                },
              },
              orbCount: fullUpdateData.lookingFor.orbs,
            },
          },
        },
        // For canGive, delete all existing entries and create new ones
        canGive: {
          deleteMany: {},
          createMany: {
            data: fullUpdateData.canGiveDragons.map((canGive) => ({
              dragonsId: canGive.dragonId,
              orbCount: canGive.orbs,
              ratioLeft: canGive.ratioLeft,
              ratioRight: canGive.ratioRight,
            })),
          },
        },
      }),
    },
    include: {
      lookingFor: {
        include: {
          dragon: true,
        },
      },
      canGive: {
        include: {
          dragon: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return updatedTrade;
}

/**
 * Soft delete a trade by setting its isDeleted flag to true
 * @param tradeId The ID of the trade to delete
 * @param userId The ID of the user attempting to delete the trade
 * @returns The deleted trade record or null if the trade doesn't exist or user doesn't have permission
 */
export async function deleteTrade(tradeId: string, userId: string) {
  // First verify that the trade exists and belongs to the user
  const existingTrade = await prisma.trade.findFirst({
    where: {
      id: tradeId,
      userId: userId,
    },
  });

  if (!existingTrade) {
    return null;
  }

  // Soft delete by setting isDeleted to true
  const deletedTrade = await prisma.trade.update({
    where: { id: tradeId },
    data: { isDeleted: true },
    include: {
      lookingFor: {
        include: {
          dragon: true,
        },
      },
      canGive: {
        include: {
          dragon: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return deletedTrade;
}

// Create a trade request
export async function createTradeRequest(tradeId: string, userId: string) {
  try {
    // Check if user has already requested this trade
    const existingRequest = await prisma.tradeRequest.findUnique({
      where: {
        tradeId_userId: {
          tradeId,
          userId
        }
      }
    });

    if (existingRequest) {
      return { success: false, message: 'You have already requested this trade' };
    }

    // Check if trade exists and is visible
    const trade = await prisma.trade.findFirst({
      where: {
        id: tradeId,
        isVisible: true,
        isDeleted: false
      }
    });

    if (!trade) {
      return { success: false, message: 'Trade not found or not available' };
    }

    // Don't allow users to request their own trades
    if (trade.userId === userId) {
      return { success: false, message: 'You cannot request your own trade' };
    }

    // Create the trade request
    const tradeRequest = await prisma.tradeRequest.create({
      data: {
        trade: {
          connect: { id: tradeId }
        },
        createdBy: {
          connect: { id: userId }
        }
      },
      include: {
        createdBy: {
          include: {
            Contacts: true
          }
        },
        trade: true
      }
    });

    return { success: true, data: tradeRequest };
  } catch (error) {
    console.error('Error creating trade request:', error);
    return { success: false, message: 'Failed to create trade request' };
  }
}

// Get trade requests for a specific trade
export async function getTradeRequestsForTrade(tradeId: string, userId: string) {
  try {
    // Verify the user owns this trade
    const trade = await prisma.trade.findFirst({
      where: {
        id: tradeId,
        userId
      }
    });

    if (!trade) {
      return { success: false, message: 'Trade not found or you do not have permission to view its requests' };
    }

    // Get all requests for this trade with user details
    const requests = await prisma.tradeRequest.findMany({
      where: {
        tradeId
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
            Contacts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return { success: true, data: requests };
  } catch (error) {
    console.error('Error fetching trade requests:', error);
    return { success: false, message: 'Failed to fetch trade requests' };
  }
}

// Export the Trade type from Prisma
export type { Trade } from "@prisma/client";

// Re-export other types for backward compatibility
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
// UI-specific trade type with related data
export type UITrade = ThenArg<ReturnType<typeof getTrades>>[number];
export type UITrades = UITrade[];
export interface TradeFilters {
  lookingForDragonIds?: string[];
  canGiveDragonIds?: string[];
  familyName?: string;
  rarity?: Rarity;
  element?: Elements;
  isSponsored?: boolean;
}
