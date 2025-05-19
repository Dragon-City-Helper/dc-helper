'use client';

import { notFound, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import dynamicImport from 'next/dynamic';
import TradeDetail from '@/components/trading/TradeDetail';
import { getTradeById } from '@/services/trades';
import { updateTradeApi, UpdateTradeData } from '@/services/tradeApi';
import { sendGAEvent } from '@next/third-parties/google';

// Define the TradeFormValues interface
interface TradeFormValues {
  lookingFor: {
    dragonId: string;
    orbs: number;
  };
  canGiveDragons: Array<{
    dragonId: string;
    orbs: number;
    ratioLeft: number;
    ratioRight: number;
  }>;
}

// Dynamically import CreateUpdateTradeModal with no SSR
const CreateUpdateTradeModal = dynamicImport<{
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<boolean>;
  trade: any;
}>(
  () => import('@/components/CreateUpdateTradeModal').then((mod) => mod.default as any),
  { ssr: false }
);

interface TradeDetailPageProps {
  params: {
    id: string;
  };
}

export default function TradeDetailPage({ params }: TradeDetailPageProps) {
  const router = useRouter();
  const [trade, setTrade] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateModalOpened, setUpdateModalOpened] = useState(false);
  const [tradeToEdit, setTradeToEdit] = useState<any>(null);

  useEffect(() => {
    const loadTrade = async () => {
      try {
        const tradeData = await getTradeById(params.id);
        if (!tradeData) {
          notFound();
        }
        setTrade(tradeData);
      } catch (error) {
        console.error('Error loading trade:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to load trade details',
          color: 'red',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTrade();
  }, [params.id]);

  const handleEditTrade = (trade: any) => {
    setTradeToEdit(trade);
    setUpdateModalOpened(true);
  };

  const handleUpdateTrade = async (values: TradeFormValues) => {
    if (!tradeToEdit) return false;

    try {
      const updateData: UpdateTradeData = {
        lookingForDragon: {
          dragonId: values.lookingFor.dragonId,
          orbs: values.lookingFor.orbs,
        },
        canGiveDragons: values.canGiveDragons.map((d) => ({
          dragonId: d.dragonId,
          orbs: d.orbs,
          ratioLeft: d.ratioLeft,
          ratioRight: d.ratioRight,
        })),
      };

      await updateTradeApi(tradeToEdit.id, updateData);
      
      // Track trade update in Google Analytics
      sendGAEvent("event", "update_trade", {
        trade_id: tradeToEdit.id,
        dragon_requested: values.lookingFor.dragonId,
        orbs_requested: values.lookingFor.orbs,
        dragons_offered: values.canGiveDragons.length,
      });
      
      // Refresh the page to show updated data
      router.refresh();
      
      notifications.show({
        title: 'Success',
        message: 'Trade updated successfully',
        color: 'green',
      });
      
      return true;
    } catch (error) {
      console.error('Error updating trade:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update trade',
        color: 'red',
      });
      return false;
    } finally {
      setUpdateModalOpened(false);
      setTradeToEdit(null);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!trade) {
    notFound();
  }

  return (
    <>
      <TradeDetail 
        trade={trade} 
        onEditTrade={handleEditTrade}
      />
      
      {tradeToEdit && (
        <CreateUpdateTradeModal
          opened={isUpdateModalOpened}
          onClose={() => setUpdateModalOpened(false)}
          onSubmit={handleUpdateTrade}
          trade={tradeToEdit}
        />
      )}
    </>
  );
}

export const dynamic = 'force-dynamic';
