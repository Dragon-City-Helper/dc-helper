import { FC } from "react";
import { Elements } from "@prisma/client";
import { DragonFilters } from ".";
import Select from "../Select";
import ElementImage from "../ElementImage";
import { elements, ElementsNames } from "@/constants/Dragon";

const ElementFilter: FC<DragonFilters> = ({ filters, onFilterChange }) => {
  const options = elements.map((element) => ({
    value: element,
    label: ElementsNames[element],
  }));
  return (
    <Select
      onChange={(value) => onFilterChange("element", value)}
      label="Element"
      placeholder="Select an element"
      data={options}
      value={filters.element}
      icon={(option) => <ElementImage element={option.value as Elements} />}
    />
  );
};

export default ElementFilter;
