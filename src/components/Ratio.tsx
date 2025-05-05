import { FC } from "react";
import { Group, NumberInput, Text } from "@mantine/core";

interface RatioProps {
  left: number;
  right: number;
  onLeftChange: (value: number) => void;
  onRightChange: (value: number) => void;
  label?: string;
}

const Ratio: FC<RatioProps> = ({
  left,
  right,
  onLeftChange,
  onRightChange,
  label,
}) => {
  return (
    <Group align="flex-end" w="100%">
      {label && (
        <Text size="sm" fw={500}>
          {label}
        </Text>
      )}
      <NumberInput
        value={left}
        onChange={(value) => onLeftChange(Number(value))}
        min={1}
        max={4}
        defaultValue={1}
      />
      <Text> : </Text>
      <NumberInput
        value={right}
        onChange={(value) => onRightChange(Number(value))}
        min={1}
        max={4}
        defaultValue={1}
      />
    </Group>
  );
};

export default Ratio;
