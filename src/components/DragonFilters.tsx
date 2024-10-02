import { elements, ElementsNames, rarities, RarityNames } from "@/types/Dragon";
import { dragons, Elements, Rarity } from "@prisma/client";
import { Component, FC } from "react";

export interface IFilters {
  search?: string;
  show?: "all" | "owned" | "unowned";
  rarity?: Rarity | "all";
  element?: Elements | "all";
  familyName?: string;
  skins?: "all" | "skins" | "dragons";
}

interface DragonFilters {
  onFilterChange: (key: keyof IFilters, e: any) => void;
  filters: IFilters;
  allowedFilters?: (keyof IFilters)[];
  dragons: dragons[];
}

const SearchFilter: FC<DragonFilters> = ({ filters, onFilterChange }) => {
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
const RarityFilter: FC<DragonFilters> = ({ filters, onFilterChange }) => {
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
const ElementFilter: FC<DragonFilters> = ({ filters, onFilterChange }) => {
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

const ShowFilter: FC<DragonFilters> = ({ filters, onFilterChange }) => {
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

const FamilyFilter: FC<DragonFilters> = ({
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
        <option value="">All Dragons</option>
        {options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};
const SkinsFilter: FC<DragonFilters> = ({ filters, onFilterChange }) => {
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
        <option value="all">Skins and Dragons</option>
        <option value="skins">Skins Only</option>
        <option value="dragons">Dragons Only</option>
      </select>
    </label>
  );
};
const filterToComponent: { [key in keyof IFilters]: FC<DragonFilters> } = {
  search: SearchFilter,
  show: ShowFilter,
  rarity: RarityFilter,
  element: ElementFilter,
  familyName: FamilyFilter,
  skins: SkinsFilter,
};
const DragonFilters: FC<DragonFilters> = ({
  onFilterChange,
  filters,
  allowedFilters = [
    "search",
    "element",
    "familyName",
    "rarity",
    "skins",
    "show",
  ],
  dragons,
}) => {
  return (
    <div className="flex items-start flex-wrap gap-8 w-full">
      {allowedFilters.map((filter) => {
        const Component = filterToComponent[filter];
        return Component ? (
          <Component
            onFilterChange={onFilterChange}
            filters={filters}
            dragons={dragons}
          />
        ) : (
          ""
        );
      })}
    </div>
  );
};

export default DragonFilters;
