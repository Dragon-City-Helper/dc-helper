import { type UITrades } from "@/services/trades";

export interface TradeResponse {
  id: string;
  userId: string;
  isVisible: boolean;
  isDeleted: boolean;
  isSponsored: boolean;
  handleEssences: string;
  lookingFor: {
    id: string;
    dragon: {
      id: string;
      name: string;
      rarity: string;
      thumbnail: string;
      familyName: string;
      isSkin: boolean;
      isVip: boolean;
      hasSkills: boolean;
      hasAllSkins: boolean;
      skillType: string | null;
    };
    orbCount: number;
  };
  canGive: Array<{
    id: string;
    dragon: {
      id: string;
      name: string;
      rarity: string;
      thumbnail: string;
      familyName: string;
      isSkin: boolean;
      isVip: boolean;
      hasSkills: boolean;
      hasAllSkins: boolean;
      skillType: string | null;
    };
    orbCount: number;
    ratioLeft: number;
    ratioRight: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const tradesApi = {
  async browseTrades(): Promise<UITrades> {
    try {
      const response = await fetch("/api/trades/browse", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        next: { revalidate: 60 }, // Revalidate every minute
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `API request failed with status ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("Error in browseTrades:", error);
      throw error;
    }
  },

  async getMyTrades(): Promise<UITrades> {
    try {
      const response = await fetch('/api/trades/me', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to fetch trades. Status: ${response.status}`
        );
      }

      const data: UITrades = await response.json();
      return data;
    } catch (error) {
      console.error('Error in getMyTrades:', error);
      throw error;
    }
  },
};
