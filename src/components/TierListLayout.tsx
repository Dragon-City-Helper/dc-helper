import { RateDragons } from "@/services/dragons";
import { FC, useMemo } from "react";
import DragonFaceCard from "./DragonFaceCard";
import {
  AllowedRatingKeys,
  getRatingText,
  ratings,
  ratingStyles,
} from "@/constants/Rating";

interface ITierListLayoutProps {
  dragons: RateDragons;
  ratingKey: AllowedRatingKeys;
}
const TierListLayout: FC<ITierListLayoutProps> = ({ dragons, ratingKey }) => {
  const dragonsByRating = useMemo(() => {
    return dragons.reduce((acc: { [key in string]: RateDragons }, dragon) => {
      const rating = dragon.rating?.[ratingKey] ?? 0;
      const ratingText = getRatingText(rating);
      // Initialize array for the rating if it doesn't exist
      if (!acc[ratingText]) {
        acc[ratingText] = [];
      }
      // Add the dragon to the appropriate rating array
      acc[ratingText].push(dragon);
      return acc;
    }, {});
  }, [dragons, ratingKey]);

  return (
    <div className="flex flex-wrap flex-col">
      {ratings.map((rating) => (
        <div
          key={rating.label}
          className="flex items-center justify-center border-b-2 border-black min-h-44"
          style={{
            ...ratingStyles[rating.label],
          }}
        >
          <div className="flex w-1/12 text-center h-full items-center justify-center">
            {rating.label}
          </div>
          <div className="flex flex-wrap w-11/12 gap-4 p-2">
            {dragonsByRating[rating.label]?.length > 0 &&
              dragonsByRating[rating.label].map((dragon) => (
                <DragonFaceCard dragon={dragon} key={dragon.id} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TierListLayout;
