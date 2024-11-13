import { ratings } from "@/constants/Rating";
import { BaseDragons } from "@/services/dragons";
import { FC } from "react";
import Select from "./Select";

interface IRatingDropdown {
  dragon: BaseDragons[number];
  ratingKey: string;
  value?: number | null;
  onRatingChange: (
    dragon: BaseDragons[number],
    ratingKey: string,
    value: number,
  ) => void;
}

const RatingDropdown: FC<IRatingDropdown> = ({
  dragon,
  ratingKey,
  value,
  onRatingChange,
}) => {
  return (
    <Select
      className="select select-bordered w-full max-w-xs"
      value={value?.toString()}
      onChange={(value) =>
        onRatingChange(dragon, ratingKey, parseInt(value ?? "0", 10))
      }
      data={ratings}
    />
  );
};

export default RatingDropdown;
