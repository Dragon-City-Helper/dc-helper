"use client";
import { dragonWithSkillsAndRating } from "@/services/dragons";
import { FC } from "react";
import DragonProfile from "./DragonProfile";
import DragonRatings from "./DragonRatings";
import DragonSkills from "./DragonSkills";
import DragonSkinChanges from "./DragonSkinChanges";
import { Group, Stack, Title, Grid, Container } from "@mantine/core";
import FamilyImage from "./FamilyImage";

interface IDragonDetailsProps {
  dragon: dragonWithSkillsAndRating;
}
const DragonDetails: FC<IDragonDetailsProps> = ({ dragon }) => {
  return (
    <Container>
      <Group my="lg">
        {dragon.familyName && (
          <FamilyImage familyName={dragon.familyName} height={36} />
        )}
        <Title order={2}>{dragon.isSkin ? dragon.skinName : dragon.name}</Title>
      </Group>
      <Group wrap="wrap" align="start">
        <DragonProfile dragon={dragon} />
        <Stack>
          <DragonRatings dragon={dragon} />
          {dragon.isSkin ? (
            <DragonSkinChanges dragon={dragon} />
          ) : (
            <DragonSkills dragon={dragon} />
          )}
        </Stack>
      </Group>
    </Container>
  );
};

export default DragonDetails;
