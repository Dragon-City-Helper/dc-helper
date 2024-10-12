import {
  AllowedRatingKeys,
  elementRatingKeys,
  getRatingText,
  RatingKeysToText,
  skillRatingKeys,
} from "@/constants/Rating";
import { dragonWithSkillsAndRating } from "@/services/dragons";
import { FC } from "react";

interface IDragonRatingsProps {
  dragon: dragonWithSkillsAndRating;
}

const DragonRatings: FC<IDragonRatingsProps> = ({ dragon }) => {
  return (
    <div className="flex gap-6 w-full flex-col">
      <div className="flex justify-between items-center border border-gray-200 p-2 rounded-box">
        Ratings
      </div>
      <div className="flex gap-6 w-full">
        <div className="flex flex-col gap-4 w-1/2">
          <div>Skill Ratings</div>
          {skillRatingKeys.map((ratingKey: AllowedRatingKeys) => (
            <div
              key={`${dragon.id}-${ratingKey}`}
              className="flex justify-between items-center"
            >
              {RatingKeysToText[ratingKey]} -
              <b className="block">
                {getRatingText(dragon.rating?.[ratingKey] || 0)}
              </b>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 w-1/2">
          <div>Element Ratings</div>
          {elementRatingKeys.map((ratingKey: AllowedRatingKeys) => (
            <div
              key={`${dragon.id}-${ratingKey}`}
              className="flex justify-between items-center"
            >
              {RatingKeysToText[ratingKey]} -
              <b className="block">
                {getRatingText(dragon.rating?.[ratingKey] || 0)}
              </b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DragonRatings;
