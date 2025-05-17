// API service for trade operations
import { notifications } from "@mantine/notifications";
import { sendGAEvent } from "@next/third-parties/google";
import { UITrades } from "./trades";

export interface UpdateTradeData {
  lookingForDragon?: {
    dragonId: string;
    orbs: number;
  };
  canGiveDragons?: Array<{
    dragonId: string;
    orbs: number;
    ratioLeft: number;
    ratioRight: number;
  }>;
  isVisible?: boolean;
  isDeleted?: boolean;
}

/**
 * Fetch trade requests for a specific trade
 */
export const fetchTradeRequests = async (tradeId: string) => {
  try {
    const response = await fetch(`/api/trade-requests?tradeId=${tradeId}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch trade requests');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching trade requests:', error);
    return [];
  }
};

/**
 * Request a trade - sends contact information to trade owner
 */
export const requestTrade = async (trade: UITrades[number]) => {
  try {
    const response = await fetch('/api/trade-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tradeId: trade.id }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to request trade');
    }
    
    // Track trade request in Google Analytics
    sendGAEvent("event", "request_trade", {
      dragon_requested: trade.lookingFor.dragon.name,
      trade_id: trade.id
    });
    
    notifications.show({
      title: 'Success',
      message: 'Trade request sent successfully. The trade owner will be able to see your contact details.',
      color: 'green',
    });
    
    return true;
  } catch (error) {
    console.error('Error requesting trade:', error);
    notifications.show({
      title: 'Error',
      message: error instanceof Error ? error.message : 'Failed to request trade',
      color: 'red',
    });
    return false;
  }
};

/**
 * Delete a trade (soft delete)
 */
export const deleteTrade = async (trade: UITrades[number]) => {
  try {
    const response = await fetch(`/api/trades/${trade.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isDeleted: true }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete trade');
    }
    
    // Track successful trade deletion in Google Analytics
    sendGAEvent("event", "delete_trade_confirm", {
      trade_id: trade.id,
      dragon_requested: trade.lookingFor.dragon.name
    });
    
    notifications.show({
      title: 'Success',
      message: 'Trade deleted successfully',
      color: 'green',
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting trade:', error);
    notifications.show({
      title: 'Error',
      message: error instanceof Error ? error.message : 'Failed to delete trade',
      color: 'red',
    });
    return false;
  }
};

/**
 * Toggle trade visibility
 */
/**
 * Update a trade
 */
export const updateTradeApi = async (tradeId: string, data: UpdateTradeData) => {
  try {
    const response = await fetch(`/api/trades/${tradeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update trade');
    }
    
    const result = await response.json();
    
    // Track successful trade update in Google Analytics
    sendGAEvent("event", "update_trade", {
      trade_id: tradeId,
      fields_updated: Object.keys(data)
    });
    
    notifications.show({
      title: 'Success',
      message: 'Trade updated successfully',
      color: 'green',
    });
    
    return result;
  } catch (error) {
    console.error('Error updating trade:', error);
    notifications.show({
      title: 'Error',
      message: error instanceof Error ? error.message : 'Failed to update trade',
      color: 'red',
    });
    throw error;
  }
};

/**
 * Toggle trade visibility
 */
export const toggleTradeVisibility = async (trade: UITrades[number]) => {
  try {
    const newVisibility = !trade.isVisible;
    const response = await fetch(`/api/trades/${trade.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isVisible: newVisibility }),
    });

    if (!response.ok) {
      throw new Error('Failed to update trade visibility');
    }
    
    // Track visibility toggle in Google Analytics
    sendGAEvent("event", "toggle_trade_visibility", {
      trade_id: trade.id,
      new_status: newVisibility ? "visible" : "hidden"
    });

    notifications.show({
      title: 'Success',
      message: `Trade ${trade.isVisible ? "hidden" : "visible"} successfully!`,
      color: 'green',
    });
    
    return true;
  } catch (error) {
    console.error('Error toggling trade visibility:', error);
    notifications.show({
      title: 'Error',
      message: 'Failed to update trade. Please try again.',
      color: 'red',
    });
    return false;
  }
};
