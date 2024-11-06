import { FC } from "react";
import { Elements } from "@prisma/client";
import Select from "../Select";
import ElementImage from "../ElementImage";
import { elements, ElementsNames } from "@/constants/Dragon";
import { IDragonFilters } from "@/types/filters";

const ElementFilter: FC<IDragonFilters> = ({
  filters,
  onFilterChange,
  disabled,
}) => {
  const options = elements.map((element) => ({
    value: element,
    label: ElementsNames[element],
  }));
  return (
    <Select
      onChange={(value) => onFilterChange("element", value)}
      label="Element"
      disabled={disabled}
      placeholder="Select an element"
      data={options}
      value={filters.element}
      icon={(option) => <ElementImage element={option.value as Elements} />}
    />
  );
};

export default ElementFilter;
