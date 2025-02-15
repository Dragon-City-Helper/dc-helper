import {
  AllowedRatingKeys,
  elementRatingKeys,
  RatingKeysToText,
  RatingKeyTooltips,
  skillRatingKeys,
} from "@/constants/Rating";
import { fullDragon } from "@/services/dragons";
import { FC } from "react";
import RatingBadge from "./RatingBadge";
import {
  Text,
  Title,
  Group,
  Box,
  SimpleGrid,
  Popover,
  Blockquote,
} from "@mantine/core";
import { IconHelp, IconInfoCircle } from "@tabler/icons-react";

interface IDragonRatingsProps {
  dragon: fullDragon;
}

const DragonRatings: FC<IDragonRatingsProps> = ({ dragon }) => {
  return (
    <Box>
      <Title order={3}>Ratings</Title>
      <Group justify="space-between" mt="md">
        <Group>
          <Text>{RatingKeysToText["overall"]}</Text>
          <Popover width={200} withArrow shadow="md">
            <Popover.Target>
              <IconHelp />
            </Popover.Target>
            <Popover.Dropdown>
              <Text>{RatingKeyTooltips["overall"]}</Text>
            </Popover.Dropdown>
          </Popover>
        </Group>
        <RatingBadge rating={dragon.rating?.overall} />
      </Group>
      <Text fw="bold" my="md">
        Skill Ratings
      </Text>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        {skillRatingKeys.map((ratingKey: AllowedRatingKeys) => (
          <Group key={`${dragon.id}-${ratingKey}`} justify="space-between">
            <Group>
              <Text>{RatingKeysToText[ratingKey]}</Text>
              <Popover width={200} withArrow shadow="md">
                <Popover.Target>
                  <IconHelp />
                </Popover.Target>
                <Popover.Dropdown>
                  <Text>{RatingKeyTooltips[ratingKey]}</Text>
                </Popover.Dropdown>
              </Popover>
            </Group>
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
            <Group>
              <Text>{RatingKeysToText[ratingKey]}</Text>
              <Popover width={200} withArrow shadow="md">
                <Popover.Target>
                  <IconHelp />
                </Popover.Target>
                <Popover.Dropdown>
                  <Text>{RatingKeyTooltips[ratingKey]}</Text>
                </Popover.Dropdown>
              </Popover>
            </Group>
            <RatingBadge rating={dragon.rating?.[ratingKey]} />
          </Group>
        ))}
      </SimpleGrid>
      {dragon.rating?.notes?.trim() && (
        <>
          <Blockquote icon={<IconInfoCircle />} mt="xl" color="gold">
            {dragon.rating?.notes}
          </Blockquote>
        </>
      )}
    </Box>
  );
};

export default DragonRatings;
