"use client";
import { fullDragon } from "@/services/dragons";
import { List, Title, Text, Box } from "@mantine/core";
import { FC } from "react";

interface IDragonSkinChangesProps {
  dragon: fullDragon;
}

const DragonSkinChanges: FC<IDragonSkinChangesProps> = ({ dragon }) => {
  const skinChangeDetails = (dragon?.skinDescription ?? "").split("||");
  return (
    <Box my="md">
      <Title order={3}>Skin Details</Title>
      {skinChangeDetails?.length > 0 ? (
        <List listStyleType="disc">
          {skinChangeDetails.map((change, index) => (
            <List.Item key={index} my="md">
              {change}
            </List.Item>
          ))}
        </List>
      ) : (
        <Text>Comsteic Skin</Text>
      )}
    </Box>
  );
};

export default DragonSkinChanges;
