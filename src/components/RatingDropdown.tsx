import { ratings } from "@/constants/Rating";
import { dragonsWithRating } from "@/services/dragons";
import { FC } from "react";

interface IRatingDropdown {
  dragon: dragonsWithRating[number];
  ratingKey: string;
  value?: number | null;
  onRatingChange: (
    dragon: dragonsWithRating[number],
    ratingKey: string,
    value: number
  ) => void;
}

const RatingDropdown: FC<IRatingDropdown> = ({
  dragon,
  ratingKey,
  value,
  onRatingChange,
}) => {
  return (
    <select
      className="select select-bordered w-full max-w-xs"
      value={value ?? 0}
      onChange={(e) =>
        onRatingChange(dragon, ratingKey, parseInt(e.target.value, 10))
      }
    >
      {ratings.map((rating) => (
        <option
          key={`${dragon.id}-${ratingKey}-${rating.label}`}
          value={rating.value}
        >
          {rating.label}
        </option>
      ))}
    </select>
  );
};

export default RatingDropdown;
