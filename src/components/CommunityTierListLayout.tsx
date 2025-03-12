import { BaseDragons } from "@/services/dragons";
import { FC, useMemo, useState } from "react";
import DragonFaceCard from "./DragonFaceCard";
import {
  CommunityRatings,
  CommunityRatingStyles,
  getCommunityRatingText,
  ratings,
  ratingStyles,
} from "@/constants/Rating";
import { SimpleGrid, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import DragonPanel from "./DragonPanel";
import { sendGAEvent } from "@next/third-parties/google";

interface ICommunityTierListLayoutProps {
  dragons: BaseDragons;
  ratingKey: "arena" | "design";
}
const CommunityTierListLayout: FC<ICommunityTierListLayoutProps> = ({
  dragons,
  ratingKey,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const [selectedDragon, setSelectedDragon] = useState<BaseDragons[number]>();

  const dragonsByRating = useMemo(() => {
    const sortedDragons = dragons.sort(
      (a, b) =>
        (b.userRatings?.[ratingKey]?.rating ?? 0) -
        (a.userRatings?.[ratingKey]?.rating ?? 0)
    );
    return sortedDragons.reduce(
      (acc: { [key in string]: BaseDragons }, dragon) => {
        const rating = dragon.userRatings?.[ratingKey]?.rating ?? undefined;
        const ratingText = getCommunityRatingText(rating);
        // Initialize array for the rating if it doesn't exist
        if (!acc[ratingText]) {
          acc[ratingText] = [];
        }
        // Add the dragon to the appropriate rating array
        acc[ratingText].push(dragon);
        return acc;
      },
      {}
    );
  }, [dragons, ratingKey]);

  const onDragonClick = (dragon: BaseDragons[number]) => {
    setSelectedDragon(dragon);
    sendGAEvent("event", "open_dragon_panel", {
      ...dragon,
    });
    open();
  };

  return (
    <Stack gap={0}>
      {CommunityRatings.map((rating) => (
        <Stack
          key={rating.label}
          p="md"
          style={{
            ...CommunityRatingStyles[rating.label],
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

export default CommunityTierListLayout;
