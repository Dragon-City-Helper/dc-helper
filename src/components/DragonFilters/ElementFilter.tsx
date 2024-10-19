import { elements, ElementsNames } from "@/constants/Dragon";
import { FC } from "react";
import { DragonFilters } from ".";

export const ElementFilter: FC<DragonFilters> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">Element</span>
      </div>
      <select
        className="select select-bordered"
        onChange={(e) => onFilterChange("element", e)}
        value={filters.element}
      >
        <option value="all">All Dragons</option>
        {elements.map((element) => (
          <option value={element} key={element}>
            {ElementsNames[element]}
          </option>
        ))}
      </select>
    </label>
  );
};
