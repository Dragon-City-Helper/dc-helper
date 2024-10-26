"use client";
import { dragonWithSkillsAndRating } from "@/services/dragons";
import { List, Title, Text, Card, Stack } from "@mantine/core";
import { FC } from "react";

interface IDragonSkinChangesProps {
  dragon: dragonWithSkillsAndRating;
}

const DragonSkinChanges: FC<IDragonSkinChangesProps> = ({ dragon }) => {
  const skinChangeDetails = (dragon?.skinDescription ?? "").split("||");
  return (
    <Card>
      <Stack>
        <Title order={3}>Skin Details</Title>
        {skinChangeDetails?.length > 0 ? (
          <List>
            {skinChangeDetails.map((change, index) => (
              <List.Item key={index}>{change}</List.Item>
            ))}
          </List>
        ) : (
          <Text>Comsteic Skin</Text>
        )}
      </Stack>
    </Card>
  );
};

export default DragonSkinChanges;
