import { FC } from "react";
import { Group, Text, Box } from "@mantine/core";
import { TradeDragons } from "@/services/dragons";
import TradeDragonFaceCard from "./TradeDragonFaceCard";
import Select from "./Select";

interface DragonSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
  dragons: TradeDragons;
  label: string;
  placeholder: string;
  loading?: boolean;
  disabled?: boolean;
  description?: string;
}

const DragonSelect: FC<DragonSelectProps> = ({
  value,
  onChange,
  dragons,
  label,
  placeholder,
  loading = false,
  disabled = false,
  description,
}) => {
  return (
    <Box>
      <Select
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        data={dragons.map((dragon) => ({
          value: dragon.id,
          label: dragon.name,
          dragon,
        }))}
        searchable
        clearable
        {...(loading && { loading: true })}
        disabled={disabled}
        description={description}
      />
    </Box>
  );
};

export default DragonSelect;
