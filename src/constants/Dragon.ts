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
export const RarityColors: Record<Rarity, string> = {
  H: "#FFEA1F",
  M: "#F692F1",
  L: "#8B2BC2",
  E: "#F8AB04",
  V: "#44D232",
  R: "#E15425",
  C: "#BCB9DF",
};

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
