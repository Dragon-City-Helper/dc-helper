import { Rarity, Rating } from "@prisma/client";
import { CSSProperties } from "react";

export const ratings = [
  {
    value: "52",
    label: "OP",
  },
  {
    value: "48",
    label: "SS",
  },
  {
    value: "44",
    label: "S++",
  },
  {
    value: "40",
    label: "S+",
  },
  {
    value: "36",
    label: "S",
  },
  {
    value: "32",
    label: "S-",
  },
  {
    value: "28",
    label: "A+",
  },
  {
    value: "24",
    label: "A",
  },
  {
    value: "20",
    label: "A-",
  },
  {
    value: "16",
    label: "B+",
  },
  {
    value: "12",
    label: "B",
  },
  {
    value: "8",
    label: "B-",
  },
  {
    value: "4",
    label: "C+",
  },
  {
    value: "0",
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
    "viability",
    "extra",
    "overall",
  ] as const;
export type AllowedRatingKeys = (typeof RatingKeys)[number];

export const RateByKeys: Exclude<AllowedRatingKeys, "extra" | "rarity">[] = [
  "overall",
  "cooldown",
  "value",
  "versatility",
  "potency",
  "primary",
  "coverage",
  "usability",
  "viability",
];

export const RatingKeyTooltips: {
  [key in AllowedRatingKeys]: string;
} = {
  overall:
    "An all-encompassing score that reflects the combined effectiveness of all ratings.",
  cooldown: "Turns required before reuse, ranked by skill power balance.",
  value: "Overall skill utility based on benefits vs. drawbacks.",
  versatility: "Effectiveness across various situations.",
  potency: "Average damage potential of the skill.",
  primary:
    "Element strength for defense; uses a different system for guards, twds, and spikes.",
  coverage: "Offensive strength, adjusted for critical-hit vulnerabilities.",
  usability: "Applicable across multiple master arenas.",
  viability: "Performance against meta picks in arenas.",
  extra: "",
  rarity: "",
};

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
  viability: "Viability",
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
  "viability",
];

export const getRatingText = (score?: number) =>
  ratings.find((rating) => parseInt(rating.value, 10) === score)?.label ?? "NR";

export const ratingStyles: {
  [key in (typeof ratings)[number]["label"]]: CSSProperties;
} = {
  OP: { backgroundColor: "#FFCCCC", color: "#8B0000" }, // Light Red BG, Dark Red Font
  SS: { backgroundColor: "#FFB6A8", color: "#8B0000" }, // Light Orange Red BG, Dark Red Font
  "S++": { backgroundColor: "#FFA07A", color: "#8B4513" }, // Light Dark Orange BG, Saddle Brown Font
  "S+": { backgroundColor: "#FFDAB9", color: "#8B4513" }, // Light Orange BG, Saddle Brown Font
  S: { backgroundColor: "#FFFACD", color: "#DAA520" }, // Light Gold BG, Goldenrod Font
  "S-": { backgroundColor: "#FFFFE0", color: "#DAA520" }, // Light Yellow BG, Goldenrod Font
  "A+": { backgroundColor: "#F0FFF0", color: "#006400" }, // Light Green BG, Dark Green Font
  A: { backgroundColor: "#E6FFE6", color: "#006400" }, // Lighter Green BG, Dark Green Font
  "A-": { backgroundColor: "#CCFFCC", color: "#006400" }, // Pale Green BG, Dark Green Font
  "B+": { backgroundColor: "#B2FFB2", color: "#228B22" }, // Light Lime Green BG, Forest Green Font
  B: { backgroundColor: "#99FF99", color: "#228B22" }, // Light Green BG, Forest Green Font
  "B-": { backgroundColor: "#80FF80", color: "#228B22" }, // Light Sea Green BG, Forest Green Font
  "C+": { backgroundColor: "#66CC99", color: "#2F4F4F" }, // Light Olive Green BG, Dark Slate Gray Font
  C: { backgroundColor: "#4CAF50", color: "#FFFFFF" }, // Medium Olive Green BG, White Font
};
