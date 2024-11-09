import { BaseDragons } from "@/services/dragons";
import { FC, useMemo, useState } from "react";
import DragonFaceCard from "./DragonFaceCard";
import {
  AllowedRatingKeys,
  getRatingText,
  ratings,
  ratingStyles,
} from "@/constants/Rating";
import { SimpleGrid, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import DragonPanel from "./DragonPanel";

interface ITierListLayoutProps {
  dragons: BaseDragons;
  ratingKey: AllowedRatingKeys;
}
const TierListLayout: FC<ITierListLayoutProps> = ({ dragons, ratingKey }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const [selectedDragon, setSelectedDragon] = useState<BaseDragons[number]>();

  const dragonsByRating = useMemo(() => {
    const sortedDragons = dragons.sort(
      (a, b) => (b.rating?.score ?? 0) - (a.rating?.score ?? 0),
    );
    return sortedDragons.reduce(
      (acc: { [key in string]: BaseDragons }, dragon) => {
        const rating = dragon.rating?.[ratingKey] ?? 0;
        const ratingText = getRatingText(rating);
        // Initialize array for the rating if it doesn't exist
        if (!acc[ratingText]) {
          acc[ratingText] = [];
        }
        // Add the dragon to the appropriate rating array
        acc[ratingText].push(dragon);
        return acc;
      },
      {},
    );
  }, [dragons, ratingKey]);

  const onDragonClick = (dragon: BaseDragons[number]) => {
    setSelectedDragon(dragon);
    open();
  };

  return (
    <Stack gap={0}>
      {ratings.map((rating) => (
        <Stack
          key={rating.label}
          p="md"
          style={{
            ...ratingStyles[rating.label],
          }}
        >
          <Title order={3}>{rating.label}</Title>
          <SimpleGrid
            cols={{ base: 3, sm: 6, lg: 8 }}
            my="sm"
            spacing={{ base: "xs", lg: "sm" }}
          >
            {dragonsByRating[rating.label]?.length > 0 &&
              dragonsByRating[rating.label].map((dragon) => (
                <DragonFaceCard
                  dragon={dragon}
                  onDragonClick={onDragonClick}
                  key={dragon.id}
                />
              ))}
          </SimpleGrid>
        </Stack>
      ))}
      <DragonPanel dragon={selectedDragon} opened={opened} close={close} />
    </Stack>
  );
};

export default TierListLayout;
