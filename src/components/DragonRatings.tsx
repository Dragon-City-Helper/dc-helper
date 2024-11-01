import {
  AllowedRatingKeys,
  elementRatingKeys,
  RatingKeysToText,
  skillRatingKeys,
} from "@/constants/Rating";
import { dragonWithSkillsAndRating } from "@/services/dragons";
import { FC } from "react";
import RatingBadge from "./RatingBadge";
import { Text, Title, Group, Box, SimpleGrid } from "@mantine/core";

interface IDragonRatingsProps {
  dragon: dragonWithSkillsAndRating;
}

const DragonRatings: FC<IDragonRatingsProps> = ({ dragon }) => {
  return (
    <Box>
      <Title order={3}>Ratings</Title>
      <Group justify="space-between" mt="md">
        <Text fw="bold">Overall</Text>
        <RatingBadge rating={dragon.rating?.overall} />
      </Group>
      <Text fw="bold" my="md">
        Skill Ratings
      </Text>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        {skillRatingKeys.map((ratingKey: AllowedRatingKeys) => (
          <Group key={`${dragon.id}-${ratingKey}`} justify="space-between">
            <Text>{RatingKeysToText[ratingKey]}</Text>
            <RatingBadge rating={dragon.rating?.[ratingKey]} />
          </Group>
        ))}
      </SimpleGrid>
      <Text fw="bold" my="md">
        Element Ratings
      </Text>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        {elementRatingKeys.map((ratingKey: AllowedRatingKeys) => (
          <Group key={`${dragon.id}-${ratingKey}`} justify="space-between">
            <Text>{RatingKeysToText[ratingKey]}</Text>
            <RatingBadge rating={dragon.rating?.[ratingKey]} />
          </Group>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default DragonRatings;
