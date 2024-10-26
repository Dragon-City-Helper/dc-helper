"use client";
import { dragonWithSkillsAndRating } from "@/services/dragons";
import { Group, Grid, Stack, Text, Title, Card } from "@mantine/core";
import Image from "next/image";
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
            <Grid key={skill.id}>
              <Grid.Col span={2}>
                <Image
                  src={`/images/skilltype/${skill.skillType}.png`}
                  alt={skill.name}
                  width={32}
                  height={32}
                  className="object-contain"
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
