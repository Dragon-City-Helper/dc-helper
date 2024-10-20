import { HomeDragons, RateDragons } from "@/services/dragons";
import { Elements, Rarity } from "@prisma/client";
import { FC } from "react";
import SearchFilter from "./SearchFilter";
import RarityFilter from "./RarityFilter";
import ElementFilter from "./ElementFilter";
import ShowFilter from "./ShowFilter";
import FamilyFilter from "./FamilyFilter";
import SkinsFilter from "./SkinsFilter";

export interface IFilters {
  search?: string;
  show?: "owned" | "unowned";
  rarity?: Rarity;
  element?: Elements;
  familyName?: string;
  skins?: "skins" | "dragons";
}

export interface DragonFilters {
  onFilterChange: (key: keyof IFilters, e: any) => void;
  filters: IFilters;
  allowedFilters?: (keyof IFilters)[];
  dragons: HomeDragons | RateDragons;
}

const filterToComponent: { [key in keyof IFilters]: FC<DragonFilters> } = {
  search: SearchFilter,
  show: ShowFilter,
  rarity: RarityFilter,
  element: ElementFilter,
  familyName: FamilyFilter,
  skins: SkinsFilter,
};

export const DragonFilters: FC<DragonFilters> = ({
  onFilterChange,
  filters,
  allowedFilters = [
    "search",
    "element",
    "familyName",
    "rarity",
    "skins",
    "show",
  ],
  dragons,
}) => {
  return (
    <div className="flex items-start flex-wrap gap-8 w-full">
      {allowedFilters.map((filter) => {
        const Component = filterToComponent[filter];
        return Component ? (
          <Component
            key={filter}
            onFilterChange={onFilterChange}
            filters={filters}
            dragons={dragons}
          />
        ) : (
          ""
        );
      })}
    </div>
  );
};

export default DragonFilters;
