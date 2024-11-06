import { FC } from "react";
import Select from "../Select";
import { IDragonFilters } from "@/types/filters";

const VipFilter: FC<IDragonFilters> = ({
  filters,
  onFilterChange,
  disabled,
}) => {
  const options = [
    {
      value: "vip",
      label: "VIP Dragons",
    },
    {
      value: "normal",
      label: "Non VIP Dragons",
    },
  ];
  return (
    <Select
      value={filters.vip}
      label="Show"
      placeholder="VIP"
      data={options}
      disabled={disabled}
      onChange={(value) => onFilterChange("vip", value)}
    />
  );
};

export default VipFilter;
