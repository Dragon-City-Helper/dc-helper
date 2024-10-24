import {
  AllowedRatingKeys,
  RatingKeys,
  RatingKeysToText,
  ratings,
  getRatingText,
} from "@/constants/Rating";
import { HomeDragons } from "@/services/dragons";
import { Card } from "@mantine/core";
import { FC, useCallback } from "react";
interface IRatingStats {
  dragons: HomeDragons;
}

const RatingStats: FC<IRatingStats> = ({ dragons }) => {
  const getRatingStats = useCallback(
    (ratingKey: AllowedRatingKeys) => {
      const dragonStats = dragons.reduce<{ [key in string]: number }>(
        (acc, curr) => {
          const scoreText = getRatingText(curr.rating?.[ratingKey] ?? 0);
          return {
            ...acc,
            [scoreText]: acc[scoreText] ? acc[scoreText] + 1 : 1,
          };
        },
        {},
      );
      return dragonStats;
    },
    [dragons],
  );
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {RatingKeys.map((ratingKey) => (
        <Card key={ratingKey} title={RatingKeysToText[ratingKey]}>
          {ratings.map((rating) => (
            <div
              key={`${ratingKey}-${rating.label}`}
              className="flex justify-between"
            >
              <div>{rating.label} :</div>
              <b>{getRatingStats(ratingKey)[rating.label] ?? 0}</b>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
};

export default RatingStats;
