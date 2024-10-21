import { FC } from "react";
import Select from "../Select";
import { IDragonFilters } from "@/types/filters";

const SkillFilter: FC<IDragonFilters> = ({ filters, onFilterChange }) => {
  const options = [
    {
      value: "any",
      label: "Any Skill",
    },
    {
      value: "no",
      label: "No Skill",
    },
    {
      value: "as",
      label: "Active Skill",
    },
    {
      value: "ps",
      label: "Passive Skill",
    },
    {
      value: "aps",
      label: "Active & Passive Skills",
    },
  ];
  return (
    <Select
      value={filters.skill}
      label="Skill"
      placeholder="Select a skillType"
      data={options}
      onChange={(value) => onFilterChange("skill", value)}
    />
  );
};

export default SkillFilter;
