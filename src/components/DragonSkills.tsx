"use client";
import { dragonWithSkillsAndRating } from "@/services/dragons";
import { Grid, Stack, Text, Title, Card, Image } from "@mantine/core";
import NextImage from "next/image";
import { FC } from "react";

interface IDragonSkillsProps {
  dragon: dragonWithSkillsAndRating;
}

const DragonSkills: FC<IDragonSkillsProps> = ({ dragon }) => {
  return (
    <Card>
      <Stack>
        <Title order={3}>Skills</Title>
        {dragon.skills?.length > 0 ? (
          dragon.skills.map((skill) => (
            <Grid key={skill.id} align="center">
              <Grid.Col span={2}>
                <Image
                  component={NextImage}
                  src={`/images/skilltype/${skill.skillType}.png`}
                  alt={skill.name}
                  width={48}
                  height={48}
                  h={48}
                  fit="contain"
                />
              </Grid.Col>
              <Grid.Col span={10}>
                <Title order={4}>{skill.name}</Title>
                <Text> {skill.description}</Text>
              </Grid.Col>
            </Grid>
          ))
        ) : (
          <Text> No Skills</Text>
        )}
      </Stack>
    </Card>
  );
};

export default DragonSkills;
