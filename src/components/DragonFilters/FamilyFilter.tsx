import { FC, useEffect, useState } from "react";
import Select from "../Select";
import FamilyImage from "../FamilyImage";
import { IDragonFilters } from "@/types/filters";

const FamilyFilter: FC<IDragonFilters> = ({
  filters,
  onFilterChange,
  disabled,
}) => {
  const [familyNames, setFamilyNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchFamilyNames = async () => {
      const response = await fetch("/api/family-names", {
        next: {
          revalidate: 86400, // 1 day
          tags: ["familyNames"],
        },
      });
      const familyNames = await response.json();
      setFamilyNames(familyNames);
    };

    fetchFamilyNames();
  }, []);

  return (
    <Select
      onChange={(value) => onFilterChange("familyName", value)}
      label="Family"
      placeholder="Select a family"
      data={familyNames}
      value={filters.familyName}
      allowDeselect
      disabled={disabled}
      icon={(option) => <FamilyImage familyName={option.value} />}
    />
  );
};

export default FamilyFilter;
