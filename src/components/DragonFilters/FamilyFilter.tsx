import { FC } from "react";
import Select from "../Select";
import FamilyImage from "../FamilyImage";
import { IDragonFilters } from "@/types/filters";

const FamilyFilter: FC<IDragonFilters> = ({
  filters,
  onFilterChange,
  dragons,
}) => {
  const familyNames = dragons
    .map((dragon) => dragon.familyName || "")
    .filter((familyName) => !!familyName);
  const uniqueFamilyNames = new Set(familyNames);

  const options = Array.from(uniqueFamilyNames)
    .sort()
    .map((family) => ({ value: family, label: family }));

  return (
    <Select
      onChange={(value) => onFilterChange("familyName", value)}
      label="Family"
      placeholder="Select a family"
      data={options}
      value={filters.familyName}
      allowDeselect
      icon={(option) => <FamilyImage familyName={option.value} />}
    />
  );
};

export default FamilyFilter;
