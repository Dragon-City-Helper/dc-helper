import { FC } from "react";
import { DragonFilters } from ".";

export const SearchFilter: FC<DragonFilters> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">Search</span>
      </div>
      <input
        type="text"
        className="input input-bordered"
        placeholder="Search by name"
        value={filters.search}
        onChange={(e) => onFilterChange("search", e)}
      />
    </label>
  );
};
