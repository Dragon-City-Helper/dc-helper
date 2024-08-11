export enum Rarity {
  "M" = "Mythical",
  "H" = "Heroic",
  "L" = "Legendary",
  "R" = "Rare",
  "C" = "Common",
  "V" = "Very Rare",
  "E" = "Epic",
}
export const rarities: (keyof typeof Rarity)[] = ["H", "M", "L", "E", "V", "R", "C"];

export enum Elements {
  "pu" = "Pure",
  "d" = "Dark",
  "f" = "Flame",
  "wr" = "War",
  "i" = "Ice",
  "w" = "Water",
  "m" = "Metal",
  "l" = "Legend",
  "mg" = "Magic",
  "li" = "Light",
  "ch" = "Chaos",
  "el" = "Electric",
  "ti" = "Time",
  "wd" = "Wind",
  "pr" = "Primal",
  "e" = "Terra",
  "p" = "Nature",
  "hp" = "Happy",
  "bt" = "Beauty",
  "so" = "Soul",
  "dr" = "Dream",
}
export const elements: (keyof typeof Elements)[] = [
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
}

export interface IDragonSimple {
  name: string;
  id: number;
  globalRank: number;
  rarityRank: number;
  categoryRank: number;
  speedRank: number;
  rarity: Rarity;
  familyName: string;
  breedable: boolean;
  elements: Elements[];
}
