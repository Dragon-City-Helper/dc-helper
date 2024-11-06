import { FC } from "react";
import Select from "../Select";
import { IDragonFilters } from "@/types/filters";

const SkinsFilter: FC<IDragonFilters> = ({
  filters,
  onFilterChange,
  disabled,
}) => {
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
      disabled={disabled}
      onChange={(value) => onFilterChange("skins", value)}
    />
  );
};

export default SkinsFilter;
