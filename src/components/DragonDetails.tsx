"use client";
import { dragonWithSkillsAndRating } from "@/services/dragons";
import { FC } from "react";
import DragonProfile from "./DragonProfile";
import DragonRatings from "./DragonRatings";
import DragonSkills from "./DragonSkills";
import DragonSkinChanges from "./DragonSkinChanges";
import { Stack, Title, Card, SimpleGrid, Center } from "@mantine/core";

interface IDragonDetailsProps {
  dragon: dragonWithSkillsAndRating;
  hideTitle?: boolean;
}
const DragonDetails: FC<IDragonDetailsProps> = ({ dragon, hideTitle }) => {
  return (
    <Card my="md">
      {!hideTitle && (
        <Center>
          <Title order={2}>
            {dragon.isSkin ? dragon.skinName : dragon.name}
          </Title>
        </Center>
      )}
      <SimpleGrid cols={{ base: 1, sm: 2 }} my="md">
        <DragonProfile dragon={dragon} />
        <Stack>
          <DragonRatings dragon={dragon} />
          {dragon.isSkin ? (
            <DragonSkinChanges dragon={dragon} />
          ) : (
            <DragonSkills dragon={dragon} />
          )}
        </Stack>
      </SimpleGrid>
    </Card>
  );
};

export default DragonDetails;
