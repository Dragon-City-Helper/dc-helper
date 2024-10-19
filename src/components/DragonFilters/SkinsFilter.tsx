import { FC } from "react";
import { DragonFilters } from ".";

export const SkinsFilter: FC<DragonFilters> = ({ filters, onFilterChange }) => {
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">Skins</span>
      </div>
      <select
        value={filters.skins}
        className="select select-bordered"
        onChange={(e) => onFilterChange("skins", e)}
      >
        <option value="all">All</option>
        <option value="skins">Skins</option>
        <option value="dragons">Skinless</option>
      </select>
    </label>
  );
};
