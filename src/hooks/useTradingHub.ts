import { useState, useEffect, useCallback } from 'react';
import { UITrades } from '@/services/trades';
import { useSession } from 'next-auth/react';

export function useTradingHub() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'browse' | 'my-trades' | 'archived'>('browse');
  const [trades, setTrades] = useState<UITrades>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = useCallback(async (tab: 'browse' | 'my-trades' | 'archived') => {
    if (status !== 'authenticated' && (tab === 'my-trades' || tab === 'archived')) {
      setError('You need to be logged in to view your trades');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      let endpoint = '/api/trades/browse';
      if (tab === 'my-trades') {
        endpoint = '/api/trades/me';
      } else if (tab === 'archived') {
        endpoint = '/api/trades/me?mode=archived';
      }
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trades');
      }
      
      const data = await response.json();
      setTrades(data);
    } catch (err) {
      console.error('Error fetching trades:', err);
      setError(err instanceof Error ? err.message : 'Failed to load trades');
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated' || activeTab === 'browse') {
      fetchTrades(activeTab);
    }
  }, [activeTab, fetchTrades, status]);

  const handleTabChange = (tab: 'browse' | 'my-trades' | 'archived') => {
    setActiveTab(tab);
  };

  const refreshTrades = () => {
    fetchTrades(activeTab);
  };

  return {
    activeTab,
    trades,
    isLoading,
    error,
    handleTabChange,
    refreshTrades,
    isAuthenticated: status === 'authenticated',
  };
}
