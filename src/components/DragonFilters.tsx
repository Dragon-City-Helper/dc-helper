import { IFilters } from "@/pages/home";
import { elements, ElementsNames, rarities, RarityNames } from "@/types/Dragon";
import { FC } from "react";

interface DragonFilters {
  onFilterChange: (key: keyof IFilters, e: any) => void;
  filters: IFilters;
}

const DragonFilters: FC<DragonFilters> = ({ onFilterChange, filters }) => {
  return (
    <div className="flex items-start flex-wrap gap-4">
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
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Rarity</span>
        </div>
        <select
          className="select select-bordered"
          onChange={(e) => onFilterChange("rarity", e)}
          value={filters.rarity}
        >
          <option value={"all"}>All Dragons</option>
          {rarities.map((rarity) => (
            <option value={rarity} key={rarity}>
              {RarityNames[rarity]}
            </option>
          ))}
        </select>
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Element</span>
        </div>
        <select
          className="select select-bordered"
          onChange={(e) => onFilterChange("element", e)}
          value={filters.element}
        >
          <option value="">All Dragons</option>
          {elements.map((element) => (
            <option value={element} key={element}>
              {ElementsNames[element]}
            </option>
          ))}
        </select>
      </label>
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
    </div>
  );
};

export default DragonFilters;
