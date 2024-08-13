import { Elements, Rarity } from "@prisma/client";

export const RarityNames: Record<Rarity, string> = {
  M: "Mythical",
  H: "Heroic",
  L: "Legendary",
  R: "Rare",
  C: "Common",
  V: "Very Rare",
  E: "Epic",
};
export const rarities: Rarity[] = ["H", "M", "L", "E", "V", "R", "C"];

export const ElementsNames: Record<Elements, string> = {
  pu: "Pure",
  d: "Dark",
  f: "Flame",
  wr: "War",
  i: "Ice",
  w: "Water",
  m: "Metal",
  l: "Legend",
  mg: "Magic",
  li: "Light",
  ch: "Chaos",
  el: "Electric",
  ti: "Time",
  wd: "Wind",
  pr: "Primal",
  e: "Terra",
  p: "Nature",
  hp: "Happy",
  bt: "Beauty",
  so: "Soul",
  dr: "Dream",
};

export const elements: Elements[] = [
  "pu",
  "d",
  "f",
  "wr",
  "i",
  "w",
  "m",
  "l",
  "mg",
  "li",
  "ch",
  "el",
  "ti",
  "wd",
  "pr",
  "e",
  "p",
  "hp",
  "bt",
  "so",
  "dr",
];

export interface IDragon {
  name: string;
  id: number;
  rank: {
    globalRank: number;
    rarityRank: number;
    categoryRank: number;
    speedRank: number;
  };
  rarity: Rarity;
  familyName: string;
  breedable: boolean;
  elements: Elements[];
  image: string;
}
