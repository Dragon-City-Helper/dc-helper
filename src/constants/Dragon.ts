import { Elements, Perk, Rarity } from "@prisma/client";

export const RarityNames: Record<Rarity, string> = {
  H: "Heroic",
  M: "Mythical",
  L: "Legendary",
  E: "Epic",
  V: "Very Rare",
  R: "Rare",
  C: "Common",
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
  w: "Sea",
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
  "e",
  "f",
  "w",
  "p",
  "el",
  "i",
  "m",
  "pr",
  "wd",
  "pu",
  "d",
  "li",
  "wr",
  "l",
  "ti",
  "bt",
  "mg",
  "ch",
  "hp",
  "dr",
  "so",
];

export const PerkNames: Record<Perk, string> = {
  H: "Health",
  R: "Reaper",
  D: "Damage",
  P: "Phoenix",
  AH: "Advanced Health",
  AD: "Advanced Damage",
  B: "Breeding",
  AB: "Advanced Breeding",
};
