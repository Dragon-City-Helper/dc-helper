import { FC } from "react";
import { DragonFilters } from ".";

export const ShowFilter: FC<DragonFilters> = ({ filters, onFilterChange }) => {
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">Show</span>
      </div>
      <select
        value={filters.show}
        className="select select-bordered"
        onChange={(e) => onFilterChange("show", e)}
      >
        <option value="all">All Dragons</option>
        <option value="owned">Owned Dragons</option>
        <option value="unowned">Unowned Dragons</option>
      </select>
    </label>
  );
};
