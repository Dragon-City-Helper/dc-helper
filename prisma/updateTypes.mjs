// fetch all dragons using prisma
// for each dragon update strength and weakness based on elementStrengths and elementWeaknesses
// save the dragons to the database

import { PrismaClient } from "@prisma/client";

const elementStrengths = {
  e: ["el", "f"],
  f: ["p", "i"],
  w: ["f", "wr"],
  p: ["w", "li"],
  el: ["w", "m"],
  i: ["p", "wr"],
  m: ["e", "i"],
  pr: ["pu"],
  wd: ["ti"],
  pu: ["wd"],
  d: ["m", "li"],
  li: ["el", "d"],
  wr: ["e", "d"],
  l: ["pr"],
  ti: ["l"],
  bt: ["dr", "hp"],
  mg: ["so", "bt"],
  ch: ["mg", "so"],
  hp: ["ch", "mg"],
  dr: ["ch", "hp"],
  so: ["dr", "bt"],
};

const ElementsNames = {
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

const prisma = new PrismaClient();

export const getDragonElementStrengths = (elements) => {
  const strengths = new Set();
  for (const element of elements) {
    elementStrengths[element].forEach((e) => strengths.add(e));
  }
  return Array.from(strengths);
};

export const getDragonElementWeaknesses = (elements) => {
  const primaryElement = elements[0];
  return Object.entries(elementStrengths)
    .filter(([el, weaknesses]) => weaknesses.includes(primaryElement))
    .flatMap(([el, weaknesses]) => el);
};

async function updateDragonTypes() {
  const dragons = await prisma.dragons.findMany();
  for (const dragon of dragons) {
    const strength = getDragonElementStrengths(dragon.elements);
    const weakness = getDragonElementWeaknesses(dragon.elements);
    //compare dragon.strong and dragon.weak against strength and weakness
    // console.log dragon name and difference in strong and weak
    // only log if strength or weakness is different
    //order the arrays
    const orderedStrength = strength.sort();
    const orderedWeakness = weakness.sort();
    const isSameStrength =
      JSON.stringify(dragon.strong.sort()) === JSON.stringify(orderedStrength);
    const isSameWeakness =
      JSON.stringify(dragon.weak.sort()) === JSON.stringify(orderedWeakness);
    if (!isSameStrength || !isSameWeakness) {
      console.log(dragon.name, dragon.id);
    }
    if (!isSameStrength) {
      console.log("strong");
      console.log({
        old: dragon.strong.map((e) => ElementsNames[e]),
        new: strength.map((e) => ElementsNames[e]),
      });
    }
    if (!isSameWeakness) {
      console.log("weak");
      console.log({
        old: dragon.weak.map((e) => ElementsNames[e]),
        new: weakness.map((e) => ElementsNames[e]),
      });
    }
    await prisma.dragons.update({
      where: { id: dragon.id },
      data: { strong: strength, weak: weakness },
    });
  }
}

updateDragonTypes();
