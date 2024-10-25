import { ratings } from "@/constants/Rating";
import { RateDragons } from "@/services/dragons";
import { NativeSelect } from "@mantine/core";
import { FC } from "react";
import Select from "./Select";

interface IRatingDropdown {
  dragon: RateDragons[number];
  ratingKey: string;
  value?: number | null;
  onRatingChange: (
    dragon: RateDragons[number],
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
      value={value?.toString() ?? "0"}
      onChange={(value) =>
        onRatingChange(dragon, ratingKey, parseInt(value ?? "0", 10))
      }
      data={ratings}
    />
  );
};

export default RatingDropdown;
