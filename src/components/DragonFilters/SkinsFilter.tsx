import { FC } from "react";
import Select from "../Select";
import { IDragonFilters } from "@/types/filters";

const SkinsFilter: FC<IDragonFilters> = ({ filters, onFilterChange }) => {
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
