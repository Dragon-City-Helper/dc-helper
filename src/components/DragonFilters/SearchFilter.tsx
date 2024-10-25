import { FC } from "react";
import { CloseButton, TextInput } from "@mantine/core";
import { IDragonFilters } from "@/types/filters";

const SearchFilter: FC<IDragonFilters> = ({ filters, onFilterChange }) => {
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
