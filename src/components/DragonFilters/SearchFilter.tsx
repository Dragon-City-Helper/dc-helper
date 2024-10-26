import { FC, useState, useEffect } from "react";
import { CloseButton, TextInput } from "@mantine/core";
import { IDragonFilters } from "@/types/filters";
import { useDebouncedValue } from "@mantine/hooks";

const SearchFilter: FC<IDragonFilters> = ({ filters, onFilterChange }) => {
  // Local state to manage the input value
  const [searchValue, setSearchValue] = useState(filters.search || "");

  // Debounced value of searchValue, updates after 500ms of inactivity
  const [debouncedSearchValue] = useDebouncedValue(searchValue, 500);

  // Update local searchValue if filters.search prop changes externally
  useEffect(() => {
    setSearchValue(filters.search || "");
  }, [filters.search]);

  // Call onFilterChange when the debounced value changes
  useEffect(() => {
    onFilterChange("search", debouncedSearchValue);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue]);

  return (
    <TextInput
      label="Search"
      placeholder="Search by name"
      value={searchValue}
      rightSectionPointerEvents="all"
      onChange={(e) => setSearchValue(e.target.value)}
      rightSection={
        <CloseButton
          aria-label="Clear input"
          onClick={() => setSearchValue("")}
          style={{ display: searchValue ? undefined : "none" }}
        />
      }
    />
  );
};

export default SearchFilter;
