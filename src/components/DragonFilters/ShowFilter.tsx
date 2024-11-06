import { FC } from "react";
import Select from "../Select";
import { IDragonFilters } from "@/types/filters";

const ShowFilter: FC<IDragonFilters> = ({
  filters,
  onFilterChange,
  disabled,
}) => {
  const options = [
    {
      value: "owned",
      label: "Owned Dragons",
    },
    {
      value: "unowned",
      label: "Unowned Dragons",
    },
  ];
  return (
    <Select
      value={filters.show}
      label="Show"
      disabled={disabled}
      placeholder="Owned or Unowned"
      data={options}
      onChange={(value) => onFilterChange("show", value)}
    />
  );
};

export default ShowFilter;
