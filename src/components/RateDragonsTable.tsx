import { Rarity, Rating, Prisma } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import RatingDropdown from "./RatingDropdown";
import { RateScreenDragons, putDragonData } from "@/services/dragons";
import {
  rarityBasedOffset,
  RatingKeys,
  RatingKeysToText,
} from "@/constants/Rating";
import {
  Box,
  Button,
  Loader,
  SimpleGrid,
  TagsInput,
  Text,
} from "@mantine/core";
import DragonFaceCard from "./DragonFaceCard";

interface IRateDragonsTableProps {
  dragons: RateScreenDragons;
}

const RateDragonsTable: FC<IRateDragonsTableProps> = ({ dragons }) => {
  const [localRatings, setLocalRatings] = useState<Record<string, Rating>>({});
  const [localTags, setLocalTags] = useState<Record<string, string[]>>({});
  const [dirty, setDirty] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    const initRatings = dragons.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.id]: curr.rating,
        dragonsId: null,
      };
    }, {});
    setLocalRatings(initRatings);

    const initTags = dragons.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.id]: curr.tags || [],
      };
    }, {});
    setLocalTags(initTags);
  }, [dragons]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/tags");
        const tags = await response.json();
        setAvailableTags(tags);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };
    fetchTags();
  }, []);

  const updateDragonData = async (id: string) => {
    setLoading({
      ...loading,
      [id]: true,
    });

    const updatedData = {
      tags: localTags[id],
      rating: localRatings[id],
    };

    try {
      const updatedDragon = await putDragonData(id, updatedData);
      if (updatedDragon?.rating) {
        setLocalRatings((ratings) => ({
          ...ratings,
          [id]: localRatings[id],
        }));
      }
      setLocalTags((tags) => ({
        ...tags,
        [id]: updatedDragon.tags,
      }));
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
    dragon: RateScreenDragons[number],
    ratingKey: string,
    value: number,
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

  const onTagsChange = (dragonId: string, newTags: string[]) => {
    setDirty({
      ...dirty,
      [dragonId]: true,
    });
    setLocalTags((prevTags) => ({
      ...prevTags,
      [dragonId]: newTags,
    }));
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

  return (
    <div className="overflow-x-auto">
      {dragons.map((dragon) => {
        return (
          <div
            key={dragon.id}
            className="w-full border-gray-700 border mt-2 p-6"
          >
            <SimpleGrid cols={{ sm: 2, xs: 1 }}>
              <Box>
                <DragonFaceCard dragon={dragon} />
                <Text>
                  <b>{dragon.name}</b>
                </Text>
                <div className="flex flex-col gap-2">
                  <b>Tags</b>
                  <TagsInput
                    value={localTags[dragon.id]}
                    onChange={(value) => onTagsChange(dragon.id, value)}
                    placeholder="Add tags"
                    maxTags={6}
                    data={availableTags}
                  />
                </div>
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
    </div>
  );
};

export default RateDragonsTable;
