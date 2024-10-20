import { FC } from "react";
import { DragonFilters } from ".";
import Select from "../Select";

const ShowFilter: FC<DragonFilters> = ({ filters, onFilterChange }) => {
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
      data={options}
      onChange={(value) => onFilterChange("show", value)}
    />
  );
};

export default ShowFilter;
