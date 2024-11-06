import { FC, ReactNode, useEffect, useState } from "react";
import { Select as MantineSelect, SelectProps, Group } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";

interface ISelectProps {
  icon?: (option: any) => ReactNode;
}
const iconProps = {
  stroke: 1.5,
  color: "currentColor",
  opacity: 0.6,
  size: 18,
};

const Select: FC<ISelectProps & SelectProps> = ({
  icon,
  disabled,
  ...rest
}) => {
  const [opened, setOpened] = useState<boolean>(false);

  const renderOption: SelectProps["renderOption"] = ({ option, checked }) => {
    return (
      <Group flex="1" gap="xs">
        {icon && icon(option)}
        {option.label}
        {checked && (
          <IconCheck style={{ marginInlineStart: "auto" }} {...iconProps} />
        )}
      </Group>
    );
  };
  useEffect(() => {
    setOpened(false);
  }, [disabled]);
  return (
    <div onClick={() => setOpened(true)} onBlurCapture={() => setOpened(false)}>
      <MantineSelect
        dropdownOpened={opened}
        renderOption={renderOption}
        allowDeselect
        {...rest}
      />
    </div>
  );
};

export default Select;
