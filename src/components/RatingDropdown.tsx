import { FC } from "react";

interface IRatingDropdown {
  dragonId: string;
  ratingKey: string;
  value?: number | null;
  onRatingChange: (dragonId: string, ratingKey: string, value: number) => void;
}

const ratings = [
  {
    value: 52,
    label: "SSS",
  },
  {
    value: 48,
    label: "SS",
  },
  {
    value: 44,
    label: "S++",
  },
  {
    value: 40,
    label: "S+",
  },
  {
    value: 36,
    label: "S",
  },
  {
    value: 32,
    label: "S-",
  },
  {
    value: 28,
    label: "A+",
  },
  {
    value: 24,
    label: "A",
  },
  {
    value: 20,
    label: "A-",
  },
  {
    value: 16,
    label: "B+",
  },
  {
    value: 12,
    label: "B",
  },
  {
    value: 8,
    label: "B-",
  },
  {
    value: 4,
    label: "C+",
  },
  {
    value: 0,
    label: "C",
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
      value={value ?? 0}
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
