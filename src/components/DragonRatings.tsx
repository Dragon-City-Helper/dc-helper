import {
  AllowedRatingKeys,
  elementRatingKeys,
  RatingKeysToText,
  skillRatingKeys,
} from "@/constants/Rating";
import { dragonWithSkillsAndRating } from "@/services/dragons";
import { FC } from "react";
import RatingBadge from "./RatingBadge";
import { Text, Title, Stack, Group, Card, SimpleGrid } from "@mantine/core";

interface IDragonRatingsProps {
  dragon: dragonWithSkillsAndRating;
}

const DragonRatings: FC<IDragonRatingsProps> = ({ dragon }) => {
  return (
    <Card>
      <Stack>
        <Title order={3}>Ratings</Title>
        <Group justify="space-between">
          <Text fw="bold">Overall</Text>
          <RatingBadge rating={dragon.rating?.overall} />
        </Group>
        <SimpleGrid cols={{ sm: 1, md: 2 }}>
          {skillRatingKeys.map((ratingKey: AllowedRatingKeys) => (
            <Group key={`${dragon.id}-${ratingKey}`} justify="space-between">
              <Text fw="bold">{RatingKeysToText[ratingKey]}</Text>
              <RatingBadge rating={dragon.rating?.[ratingKey]} />
            </Group>
          ))}

          {elementRatingKeys.map((ratingKey: AllowedRatingKeys) => (
            <Group key={`${dragon.id}-${ratingKey}`} justify="space-between">
              <Text fw="bold">{RatingKeysToText[ratingKey]}</Text>
              <RatingBadge rating={dragon.rating?.[ratingKey]} />
            </Group>
          ))}
        </SimpleGrid>
      </Stack>
    </Card>
  );
};

export default DragonRatings;
