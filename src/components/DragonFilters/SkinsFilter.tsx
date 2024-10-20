import { FC } from "react";
import { DragonFilters } from ".";
import Select from "../Select";

const SkinsFilter: FC<DragonFilters> = ({ filters, onFilterChange }) => {
  // <option value="all">All</option>
  // <option value="skins">Skins</option>
  // <option value="dragons">Skinless</option>
  const options = [
    {
      value: "skins",
      label: "Skins",
    },
    {
      value: "dragons",
      label: "Skinless",
    },
  ];
  return (
    <Select
      value={filters.skins}
      label="Skins"
      placeholder="Skin or Skinless"
      data={options}
      onChange={(value) => onFilterChange("skins", value)}
    />
  );
};

export default SkinsFilter;
