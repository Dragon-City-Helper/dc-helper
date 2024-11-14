import { fullDragon } from "@/services/dragons";
import { FC } from "react";
import { Box, Stack, Text, Group, Center, Divider } from "@mantine/core";
import ElementImage from "./ElementImage";
import { ElementsNames } from "@/constants/Dragon";

interface IDragonCoverageProps {
  dragon: fullDragon;
}
const DragonCoverage: FC<IDragonCoverageProps> = ({ dragon }) => {
  return (
    <Group justify="center">
      <Stack>
        <Text fw="bold" ta="center">
          Strong Against
        </Text>
        <Group justify="center">
          {dragon.strong.map((el) => (
            <ElementImage
              key={`${dragon.id}-strong-${ElementsNames[el]}`}
              element={el}
            />
          ))}
        </Group>
        <Text fw="bold" ta="center">
          Weak Against
        </Text>
        <Group justify="center">
          {dragon.weak.map((el) => (
            <ElementImage
              key={`${dragon.id}-weak-${ElementsNames[el]}`}
              element={el}
            />
          ))}
        </Group>
      </Stack>
    </Group>
  );
};

export default DragonCoverage;
