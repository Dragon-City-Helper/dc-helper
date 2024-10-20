import { rarities, RarityNames } from "@/constants/Dragon";
import { FC } from "react";
import { DragonFilters } from ".";
import Select from "../Select";
import RarityImage from "../RarityImage";

const RarityFilter: FC<DragonFilters> = ({ filters, onFilterChange }) => {
  const options = rarities.map((rarity) => ({
    value: rarity,
    label: RarityNames[rarity],
  }));
  return (
    <Select
      onChange={(value) => onFilterChange("rarity", value)}
      label="Rarity"
      placeholder="Select a rarity"
      data={options}
      value={filters.rarity}
      allowDeselect
      icon={(option) => <RarityImage rarity={option.value} />}
    />
  );
};
export default RarityFilter;
