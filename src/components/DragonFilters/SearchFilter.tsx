import { FC } from "react";
import { DragonFilters } from ".";
import { CloseButton, TextInput } from "@mantine/core";

const SearchFilter: FC<DragonFilters> = ({ filters, onFilterChange }) => {
  return (
    <TextInput
      label="Search"
      placeholder="Search by name"
      value={filters.search}
      rightSectionPointerEvents="all"
      onChange={(e) => onFilterChange("search", e.target.value)}
      rightSection={
        <CloseButton
          aria-label="Clear input"
          onClick={() => onFilterChange("search", "")}
          style={{ display: filters.search ? undefined : "none" }}
        />
      }
    />
  );
};

export default SearchFilter;
