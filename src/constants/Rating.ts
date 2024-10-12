import { Rarity, Rating } from "@prisma/client";

export const ratings = [
  {
    value: 52,
    label: "OP",
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

export const rarityBasedOffset: { [key in Rarity]: number } = {
  H: 200,
  M: 170,
  L: 150,
  E: 100,
  V: 80,
  R: 60,
  C: 50,
};

export const RatingKeys: Exclude<keyof Rating, "id" | "dragonsId" | "score">[] =
  [
    "cooldown",
    "value",
    "versatility",
    "potency",
    "primary",
    "coverage",
    "rarity",
    "usability",
    "extra",
    "overall",
  ] as const;
export type AllowedRatingKeys = (typeof RatingKeys)[number];

export const RatingKeysToText: { [key in AllowedRatingKeys]: string } = {
  cooldown: "Cooldown",
  value: "Value",
  versatility: "Versatility",
  potency: "Potency",
  primary: "Primary",
  coverage: " Coverage",
  rarity: "Stat Boost",
  usability: "Usability",
  extra: "Extra",
  overall: "Overall Rank",
};

export const skillRatingKeys: Partial<AllowedRatingKeys>[] = [
  "cooldown",
  "value",
  "versatility",
  "potency",
];
export const elementRatingKeys: Partial<AllowedRatingKeys>[] = [
  "primary",
  "coverage",
  "usability",
];

export const getRatingText = (score: number) =>
  ratings.find((rating) => rating.value === score)?.label ?? "NR";
