import { rarities, RarityNames } from "@/constants/Dragon";
import { FC } from "react";
import { DragonFilters } from ".";

export const RarityFilter: FC<DragonFilters> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text">Rarity</span>
      </div>
      <select
        className="select select-bordered"
        onChange={(e) => onFilterChange("rarity", e)}
        value={filters.rarity}
      >
        <option value="all">All Dragons</option>
        {rarities.map((rarity) => (
          <option value={rarity} key={rarity}>
            {RarityNames[rarity]}
          </option>
        ))}
      </select>
    </label>
  );
};
