import { HandleEssences } from "@prisma/client";

export interface CreateUpdateTradeModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: TradeFormValues) => void;
}

export interface TradeFormValues {
  lookingForDragonId: string;
  lookingForOrbs: number;
  canGiveDragons: {
    dragonId: string;
    orbs: number;
    ratioLeft: number;
    ratioRight: number;
  }[];
}
