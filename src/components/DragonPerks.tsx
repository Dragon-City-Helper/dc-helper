import { fullDragon } from "@/services/dragons";
import { FC } from "react";
import { Box, Stack, Text, Group, Center } from "@mantine/core";
import PerkImage from "./PerkImage";

interface IDragonPerksProps {
  dragon: fullDragon;
}
const DragonPerks: FC<IDragonPerksProps> = ({ dragon }) => {
  return (
    dragon.perkSuggestions?.length > 0 && (
      <Center>
        <Stack>
          {dragon.perkSuggestions.map((suggestion, index) => {
            return (
              <Box key={`${dragon.id}-perks-${index + 1}`}>
                <Text ta="center" fw="bold">
                  Perk Build {index + 1}
                </Text>
                <Group justify="center">
                  {suggestion.perk1 && (
                    <PerkImage perk={suggestion.perk1} width={48} height={48} />
                  )}
                  {suggestion.perk2 && (
                    <PerkImage perk={suggestion.perk2} width={48} height={48} />
                  )}
                </Group>
              </Box>
            );
          })}
        </Stack>
      </Center>
    )
  );
};

export default DragonPerks;
