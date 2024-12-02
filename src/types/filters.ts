import { BaseDragons } from "@/services/dragons";
import { Alliance, Elements, Rarity } from "@prisma/client";

export interface IFilters {
  search?: string;
  show?: "owned" | "unowned";
  rarity?: Rarity;
  element?: Elements;
  familyName?: string;
  skins?: "skins" | "dragons";
  skill?: "any" | "no" | "as" | "ps" | "aps";
  vip?: "vip" | "normal";
}

export interface IDragonFilters {
  onFilterChange: (key: keyof IFilters, e: any) => void;
  filters: IFilters;
  allowedFilters?: (keyof IFilters)[];
  dragons: BaseDragons;
  disabled?: boolean;
}

export interface IAllianceFilters {
  minMasterPoints?: number;
  discord?: boolean;
  contribution?: boolean;
  tags?: string[];
}

export interface IAllianceHubFilters {
  onFilterChange: (key: keyof IAllianceFilters, e: any) => void;
  filters: IAllianceFilters;
  alliances: Alliance;
  disabled?: boolean;
}
