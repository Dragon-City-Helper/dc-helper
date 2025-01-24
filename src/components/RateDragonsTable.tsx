import { Perk, Rarity, Rating } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import RatingDropdown from "./RatingDropdown";
import { BaseDragons, putDragonData } from "@/services/dragons";
import {
  rarityBasedOffset,
  RatingKeys,
  RatingKeysToText,
} from "@/constants/Rating";
import {
  Box,
  Button,
  Center,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import DragonFaceCard from "./DragonFaceCard";
import ElementImage from "./ElementImage";
import PerkSelector from "./PerkSelector";
import { IPerkSuggestion } from "@/types/perkSuggestions";

interface IRateDragonsTableProps {
  dragons: BaseDragons;
}

const RateDragonsTable: FC<IRateDragonsTableProps> = ({ dragons }) => {
  const [localRatings, setLocalRatings] = useState<Record<string, Rating>>({});
  const [dirty, setDirty] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [localPerks, setLocalPerks] = useState<
    Record<string, IPerkSuggestion[]>
  >({});

  useEffect(() => {
    const initRatings = dragons.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.id]: curr.rating,
      };
    }, {});
    setLocalRatings(initRatings);

    const initPerkSuggestions = dragons.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.id]:
          curr.perkSuggestions.map((perkSug) => ({
            perk1: perkSug.perk1,
            perk2: perkSug.perk2,
          })) || {},
      };
    }, {});
    setLocalPerks(initPerkSuggestions);
  }, [dragons]);

  const updateDragonData = async (id: string) => {
    setLoading({
      ...loading,
      [id]: true,
    });

    const updatedData = {
      rating: localRatings[id],
      perkSuggestions: localPerks[id], // Include perkSuggestions here
    };

    try {
      const updatedDragon = await putDragonData(id, updatedData);
      if (updatedDragon?.rating) {
        setLocalRatings((ratings) => ({
          ...ratings,
          [id]: localRatings[id],
        }));
      }
      setDirty({
        ...dirty,
        [id]: false,
      });
    } catch (error) {
      console.error("Failed to update dragon data:", error);
    } finally {
      setLoading({
        ...loading,
        [id]: false,
      });
    }
  };

  const onRatingChange = (
    dragon: BaseDragons[number],
    ratingKey: string,
    value: number
  ) => {
    setDirty({
      ...dirty,
      [dragon.id]: true,
    });
    setLocalRatings((rating) => {
      const newRating = {
        ...(rating || {})[dragon.id],
        [ratingKey]: value,
      };
      newRating.score = getScore(newRating, dragon.rarity);
      return {
        ...rating,
        [dragon.id]: newRating,
      };
    });
  };

  const getScore = (rating: Rating, dragonRarity: Rarity) => {
    const {
      cooldown,
      value,
      potency,
      versatility,
      primary,
      coverage,
      rarity,
      usability,
      extra,
    } = rating || {};
    return (
      (cooldown ?? 0) +
      (value ?? 0) +
      (potency ?? 0) +
      (versatility ?? 0) +
      (usability ?? 0) +
      0.5 * (primary ?? 0) +
      0.5 * (coverage ?? 0) +
      0.25 * (extra ?? 0) +
      2 * (rarity ?? 0) +
      rarityBasedOffset[dragonRarity]
    );
  };

  const onPerksChange = (
    dragonId: string,
    perkSuggestions: IPerkSuggestion[]
  ) => {
    setDirty({
      ...dirty,
      [dragonId]: true,
    });
    setLocalPerks((prevPerks) => ({
      ...prevPerks,
      [dragonId]: perkSuggestions,
    }));
  };

  return (
    <Box>
      {dragons.map((dragon) => {
        return (
          <div
            key={dragon.id}
            className="w-full border-gray-700 border mt-2 p-6"
          >
            <SimpleGrid cols={{ sm: 2, xs: 1 }}>
              <Box>
                <Center>
                  <Box w={200}>
                    <Stack>
                      <DragonFaceCard dragon={dragon} />
                      <Group justify="space-evenly" gap={4} my="sm">
                        {dragon.elements.map((element, index) => (
                          <ElementImage
                            element={element}
                            key={`${dragon.id}-${element}-${index}`}
                          />
                        ))}
                      </Group>
                    </Stack>
                  </Box>
                </Center>
                <Text w="100%" ta="center">
                  <b>{dragon.name}</b>
                </Text>
                <PerkSelector
                  onPerksChange={(perkSuggestions) =>
                    onPerksChange(
                      dragon.id,
                      perkSuggestions as IPerkSuggestion[]
                    )
                  }
                  combinations={localPerks[dragon.id] ?? []}
                />
              </Box>
              <SimpleGrid cols={{ lg: 3, xs: 2 }}>
                {RatingKeys.map((key) => (
                  <div key={key} className="flex flex-col gap-2">
                    <b>{RatingKeysToText[key]}</b>
                    <RatingDropdown
                      dragon={dragon}
                      ratingKey={key}
                      value={localRatings?.[dragon.id]?.[key]}
                      onRatingChange={onRatingChange}
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-2">
                  <b>Score</b>
                  <div>{localRatings[dragon.id]?.score ?? 0}</div>
                </div>

                {loading[dragon.id] ? (
                  <Loader />
                ) : (
                  <Button
                    onClick={() => updateDragonData(dragon.id)}
                    disabled={!dirty[dragon.id]}
                  >
                    Save
                  </Button>
                )}
              </SimpleGrid>
            </SimpleGrid>
          </div>
        );
      })}
    </Box>
  );
};

export default RateDragonsTable;
