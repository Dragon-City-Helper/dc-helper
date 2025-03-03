"use client";
import {
  AllowedRatingKeys,
  elementRatingKeys,
  RatingKeysToText,
  RatingKeyTooltips,
  skillRatingKeys,
} from "@/constants/Rating";
import { fullDragon } from "@/services/dragons";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import RatingBadge from "./RatingBadge";
import {
  Text,
  Title,
  Group,
  Box,
  SimpleGrid,
  Popover,
  Blockquote,
  Stack,
  Button,
  Badge,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconHelp, IconInfoCircle } from "@tabler/icons-react";
import { useSession, signIn } from "next-auth/react";
import { sendGAEvent } from "@next/third-parties/google";
import UserRating from "./UserRating";

interface IDragonRatingsProps {
  dragon: fullDragon;
}

const DragonRatings: FC<IDragonRatingsProps> = ({ dragon }) => {
  const [userRatings, setUserRatings] = useState<{
    arena?: number;
    design?: number;
  } | null>(null);
  const session = useSession();
  const isLoggedIn = useMemo(
    () => session.status === "authenticated",
    [session]
  );

  const getCurrentUserRatings = useCallback(async (id: string) => {
    const response = await fetch(`/api/user-ratings?dragonId=${id}`);
    const data = await response.json();
    setUserRatings(data);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getCurrentUserRatings(dragon.id);
    }
  }, [isLoggedIn, dragon.id, getCurrentUserRatings]);

  const onLoginClick = () => {
    sendGAEvent("event", "ratings_login_click", {});
    signIn();
  };

  const handleUserRatingChange =
    (type: "arena" | "design") => async (rating: number) => {
      sendGAEvent("event", `type_rating_change`, {
        user_id: session.data?.user?.id,
        rating,
        dragon_name: dragon.name,
      });
      if (userRatings?.arena || userRatings?.design) {
        await fetch("/api/user-ratings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dragonId: dragon.id,
            rating: {
              [type]: rating,
            },
          }),
        });
        notifications.show({
          title: `Rating updated successfully`,
          message:
            "Your rating has been updated! ⭐ Your contribution will update the Community Ratings within the next hour.",
        });
      } else {
        await fetch("/api/user-ratings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dragonId: dragon.id,
            rating: {
              [type]: rating,
            },
          }),
        });
        notifications.show({
          title: `Rating added successfully`,
          message:
            "Your rating has been submitted! ⭐ Your contribution will update the Community Ratings within the next hour.",
        });
      }
      setUserRatings((prev) => ({
        ...prev!,
        [type]: rating,
      }));
    };
  const handleArenaRatingChange = handleUserRatingChange("arena");
  const handleDesignRatingChange = handleUserRatingChange("design");

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
      <Group justify="flex-start">
        <Text fw="bold" my="md">
          Community Ratings
        </Text>
        <Badge color="blue">Beta</Badge>
      </Group>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Stack>
          <Group key={`${dragon.id}-user-arena`} justify="space-between">
            <Group>
              <Text>Arena</Text>
              <Popover width={200} withArrow shadow="md">
                <Popover.Target>
                  <IconHelp />
                </Popover.Target>
                <Popover.Dropdown>
                  <Text>
                    Community rating on how strong this dragon is in battles
                  </Text>
                </Popover.Dropdown>
              </Popover>
            </Group>

            {dragon.userRatings.arena.count > 0 ? (
              <Text>
                <b>{dragon.userRatings.arena.rating?.toFixed(2)}/5 </b> (
                {dragon.userRatings.arena.count})
              </Text>
            ) : (
              <RatingBadge />
            )}
          </Group>
          {isLoggedIn && (
            <UserRating
              value={userRatings?.arena || 0}
              onRatingChange={handleArenaRatingChange}
            />
          )}
        </Stack>
        {!dragon.hasAllSkins && (
          <Stack>
            <Group key={`${dragon.id}-user-design`} justify="space-between">
              <Group>
                <Text>Design</Text>
                <Popover width={200} withArrow shadow="md">
                  <Popover.Target>
                    <IconHelp />
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Text>
                      Community rating on how appealing this dragon looks.
                    </Text>
                  </Popover.Dropdown>
                </Popover>
              </Group>
              {dragon.userRatings.design.count > 0 ? (
                <Text>
                  <b>{dragon.userRatings.design.rating?.toFixed(2)}/5</b> (
                  {dragon.userRatings.design.count})
                </Text>
              ) : (
                <RatingBadge />
              )}
            </Group>
            {isLoggedIn && (
              <UserRating
                value={userRatings?.design || 0}
                onRatingChange={handleDesignRatingChange}
              />
            )}
          </Stack>
        )}
      </SimpleGrid>
      {!isLoggedIn && (
        <Group mt="md">
          You can now contribute your own ratings for this dragon! Rate its
          design and arena performance, and see how your opinions compare with
          others.
          <Button onClick={onLoginClick}>Log in to add your ratings!</Button>
        </Group>
      )}
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
