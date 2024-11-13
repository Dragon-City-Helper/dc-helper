import { fullDragon } from "@/services/dragons";
import { FC } from "react";
import { Box, Stack, Text, Group, Center } from "@mantine/core";
import PerkImage from "./PerkImage";

interface IDragonPerksProps {
  dragon: fullDragon;
}
const DragonPerks: FC<IDragonPerksProps> = ({ dragon }) => {
  return dragon.perkSuggestions.length ? (
    <Center>
      <Stack>
        {dragon.perkSuggestions.map((suggestion, index) => {
          return (
            <Box key={`${dragon.id}-perks-${index + 1}`}>
              <Text>Recommendation {index + 1}</Text>
              <Group justify="center">
                {suggestion.perk1 && <PerkImage perk={suggestion.perk1} />}
                {suggestion.perk2 && <PerkImage perk={suggestion.perk2} />}
              </Group>
            </Box>
          );
        })}
      </Stack>
    </Center>
  ) : (
    <Text ta="center">No Perk Recommendation yet.</Text>
  );
};

export default DragonPerks;
