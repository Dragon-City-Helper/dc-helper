import { FC } from "react";

interface IRatingDropdown {
  dragonId: string;
  ratingKey: string;
  value?: number | null;
  onRatingChange: (dragonId: string, ratingKey: string, value: number) => void;
}

const ratings = [
  {
    value: 13,
    label: "SSS",
  },
  {
    value: 12,
    label: "SS",
  },
  {
    value: 11,
    label: "S++",
  },
  {
    value: 10,
    label: "S+",
  },
  {
    value: 9,
    label: "S",
  },
  {
    value: 8,
    label: "S-",
  },
  {
    value: 7,
    label: "A+",
  },
  {
    value: 6,
    label: "A",
  },
  {
    value: 5,
    label: "A-",
  },
  {
    value: 4,
    label: "B+",
  },
  {
    value: 3,
    label: "B",
  },
  {
    value: 2,
    label: "B-",
  },
  {
    value: 1,
    label: "C+",
  },
];
const RatingDropdown: FC<IRatingDropdown> = ({
  dragonId,
  ratingKey,
  value,
  onRatingChange,
}) => {
  return (
    <select
      className="select select-bordered w-full max-w-xs"
      value={value ?? undefined}
      onChange={(e) =>
        onRatingChange(dragonId, ratingKey, parseInt(e.target.value, 10))
      }
    >
      {ratings.map((rating) => (
        <option
          key={`${dragonId}-${ratingKey}-${rating.label}`}
          value={rating.value}
        >
          {rating.label}
        </option>
      ))}
    </select>
  );
};

export default RatingDropdown;
