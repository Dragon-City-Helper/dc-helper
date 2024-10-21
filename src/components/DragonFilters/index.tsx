import { FC } from "react";
import SearchFilter from "./SearchFilter";
import RarityFilter from "./RarityFilter";
import ElementFilter from "./ElementFilter";
import ShowFilter from "./ShowFilter";
import FamilyFilter from "./FamilyFilter";
import SkinsFilter from "./SkinsFilter";
import { IDragonFilters, IFilters } from "@/types/filters";
import { SimpleGrid } from "@mantine/core";
import VipFilter from "./VipFilter";
// import SkillFilter from "./SkillFilter";

const filterToComponent: { [key in keyof IFilters]: FC<IDragonFilters> } = {
  search: SearchFilter,
  show: ShowFilter,
  rarity: RarityFilter,
  element: ElementFilter,
  familyName: FamilyFilter,
  skins: SkinsFilter,
  vip: VipFilter,
  // skill: SkillFilter,
};

export const DragonFilters: FC<IDragonFilters> = ({
  onFilterChange,
  filters,
  allowedFilters = [
    "search",
    "element",
    "familyName",
    "rarity",
    "skins",
    "vip",
  ],
  dragons,
}) => {
  return (
    <SimpleGrid cols={{ xs: 1, sm: 3 }}>
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
    </SimpleGrid>
  );
};

export default DragonFilters;
