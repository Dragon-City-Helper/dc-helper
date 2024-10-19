import { FC } from "react";
import { DragonFilters } from ".";

export const FamilyFilter: FC<DragonFilters> = ({
  filters,
  onFilterChange,
  dragons,
}) => {
  const familyNames = dragons
    .map((dragon) => dragon.familyName || "")
    .filter((familyName) => !!familyName);
  const uniqueFamilyNames = new Set(familyNames);
  const options = Array.from(uniqueFamilyNames).sort();
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">Family</span>
      </div>
      <select
        className="select select-bordered"
        onChange={(e) => onFilterChange("familyName", e)}
        value={filters.familyName}
      >
        <option value="all">All Dragons</option>
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};
