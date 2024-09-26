import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getImageUrl = ({ image, isThumbnail }) => {
  const host =
    "https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui";
  if (isThumbnail) {
    return `${host}/${image.replace("/ui_", "/HD/thumb_")}_3.png`;
  }
  return `${host}/${image}_3@2x.png`;
};

const skillsScore = {
  /// op
  "Reckless Victory": 4,
  "Karma Revenge": 4,
  "Dual Rebound": 4,
  "Divine Sacrifice": 4,
  "No Remorse+": 4,
  "Atomic Ace": 4,
  "Perma Wound": 4,

  /// op-
  "Time Steal": 3.5,
  "Arcana Absorption": 3.5,
  "Impaling Outrage": 3.5,
  "Leech Fang": 3.5,

  /// ss
  Ephixia: 3,
  "Hex-agony": 3,
  Megalomania: 3,
  "Blood Eclipse": 3,
  Reincarnation: 3,
  "Gamma Guard": 3,
  "Corrupted Fangs": 3,

  ///s
  "Cosmic Incineration": 2.5,
  "Drowning Deluge": 2.5,
  "Divine Intervention": 2.5,
  Rampage: 2.5,
  "Harpy Howl": 2.5,
  "Bedwyr Bash": 2.5,
  "Impaling Shelter": 2.5,
  "Enraged Hunter": 2.5,

  /// s-
  "Snow Mirror": 2,
  "Frozen Mirror": 2,
  "Claw Cutter": 2,
  Bunker: 2,
  Guard: 2,

  /// aa
  Ignition: 1.5,
  Explosion: 1.5,
  "Titan Shield": 1.5,
  "Voodoo Vortex": 1.5,
  "Last Breath": 1.5,
  "No Remorse": 1.5,
  "Vampire Bat": 1.5,
  "Pegasus Puncture": 1.5,

  ///a
  "Final Ultimatum": 1.2,
  "Vampiric Origins": 1.2,
  Katannihilation: 1.2,
  "Machete Mayhem": 1.2,
  "Kingdom's Gambit": 1.2,
  "Crossbow Commando": 1.2,
  "Arcana Emergency": 1.2,
  Fatality: 1.2,
  "Ruling Parasite": 1.2,
  Blisstonia: 1.2,
  "Maeve Mash": 1.2,
  "Roots of Rage": 1.2,

  ///b
  "Rock Throw": 1,
  "Meteor Fall": 1,
  Foam: 1,
  Wave: 1,
  Crazyness: 1,
  Berserk: 1,
  "No Survivors": 1,
  "Karma Yin": 1,
  "Mythical Ultimatum": 1,
  "Gamma Rays": 1,
  "Molten Mercury": 1,

  ///c
  "Safe-Zone Serenity": 0.75,
  "Gravity Hole": 0.75,
  "Spirit Summon": 0.75,
  "Rolling Quills": 0.75,
  "Hyper Shot": 0.75,
  "Plasma Parasite": 0.75,

  ///d
  "Root Sap": 0.5,
  "Gaia Sap": 0.5,
  "Electro Switch": 0.5,
  "Thunder Switch": 0.5,
  "Fury Jabs": 0.5,
  "Karma Yang": 0.5,
  "Soul Extraction": 0.5,

  ///e
  "Silky Slumber": 0.25,
  "Holy Light": 0.25,
  "Random Hit": 0.25,
  "Random Purge": 0.25,
  "Primal Howl": 0.25,
  "Primitive Rumble": 0.25,
  "Under-the-bus Throw": 0.25,
  Statignition: 0.25,

  ///f
  "Dual Destiny": -0.25,
  "Call For Help": -0.25,
  "Leech Seeds": -0.25,
  "Call For Backup": -0.25,
  Dragonitarian: -0.25,
  "Nail Fall": -0.25,
  "Nail Storm": -0.25,

  // special
  "Produce Food": 0,
};

export const ElementsScores = {
  pu: 1.2,
  d: 1,
  f: 0.8,
  wr: 0.8,
  i: 0.6,
  w: 1,
  m: 0.6,
  l: 1.8,
  mg: 1.2,
  li: 0.6,
  ch: 1.4,
  el: 0.8,
  ti: 1.6,
  wd: 1.2,
  pr: 1.4,
  e: 0.8,
  p: 0.6,
  hp: 1.6,
  bt: 2,
  so: 1.4,
  dr: 2,
};

export const RarityScores = {
  H: 15,
  M: 10,
  L: 8,
  E: 5,
  V: 3,
  R: 2,
  C: 1,
};
export const weights = {
  rarity: 3,
  skills: 1,
  elements: 1,
  speed: 2,
  damage: 2,
};

export const dragonSpeedScore = (dragon, minSpeed, maxSpeed) => {
  const meanSpeed = (dragon.maxSpeed + dragon.baseSpeed) / 2;
  const sd = (dragon.maxSpeed - dragon.baseSpeed) / 6;
  const dragonSpeedValue = meanSpeed + 0.674 * sd; // p75 assuming normal distribution
  return (((dragonSpeedValue - minSpeed) * 1.0) / (maxSpeed - minSpeed)) * 1000;
};

export const dragonDamageScore = (dragon, min, max) => {
  return (((dragon.maxDamage - min) * 1.0) / (max - min)) * 10000;
};

export const dragonElementsScores = (dragon) => {
  const [primary, ...rest] = dragon.elements;
  const primaryElementScore = ElementsScores[primary] * 2;
  const otherElementsScore = rest.reduce((acc, curr) => {
    return acc + ElementsScores[curr] ?? 0;
  }, 0);
  return (primaryElementScore + otherElementsScore) * 10;
};

export const dragonSkillScores = (dragon) => {
  return (dragon.skills || []).reduce((acc, curr) => {
    return acc + skillsScore[curr.name] * 10 ?? 0;
  }, 0);
};

export const dragonTotalScore = (dragon) => {
  return (
    (weights["speed"] * dragon.speedScore) / 10 +
    weights["elements"] * dragon.elementsScore +
    weights["rarity"] * dragon.rarityScore * 5 +
    weights["skills"] * dragon.skillsScore +
    (weights["damage"] * dragon.damageScore) / 100
  );
};

const fetchDragons = async ({
  dragonName = "",
  rarities = [],
  orderBy = 1,
  page = 0,
  pageSize = 5000,
  families = [],
  inStore = null,
  breedable = null,
  animation = null,
}) => {
  const response = await axios.post(
    "https://www.ditlep.com/Dragon/Search",
    {
      dragonName,
      rarities,
      orderBy,
      page,
      pageSize,
      inStore,
      families,
      breedable,
      animation,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const dragons = response.data.items
    .filter(
      ({ id }) =>
        ![1145, 1146, 1144, 1410, 1882, 1911, 1920, 1921, 1852, 1114].includes(
          id
        )
    )
    .map(
      ({
        name,
        id,
        rank,
        rarity,
        familyName,
        breedable,
        elements,
        image,
        baseSpeed,
        maxSpeed,
        maxDamage,
        skills,
        category,
      }) => ({
        name,
        dragonId: id,
        globalRank: rank.globalRank,
        rarity,
        familyName,
        breedable,
        elements,
        baseSpeed,
        maxSpeed,
        maxDamage,
        category,
        skills: skills.map((skill) => ({
          name: skill.name === "" ? "Produce Food" : skill.name,
          skillType: skill.skillType,
          description: skill.descriptionKey,
        })),
        image: getImageUrl({ image, isThumbnail: false }),
        thumbnail: getImageUrl({ image, isThumbnail: true }),
      })
    );
  const metadata = getMetadata(response.data.items);
  return { dragons, metadata };
};

function getAllSkills(dragonsRaw) {
  const skillByDescription = dragonsRaw.reduce((acc, curr) => {
    curr.skills.forEach((skill) => {
      const { descriptionKey } = skill;
      if (!acc[descriptionKey]) {
        acc[descriptionKey] = {
          [skill.name]: {
            name: skill.name,
            skillType: skill.skillType,
            dragonsWithSkill: 1,
          },
        };
      } else {
        if (acc[descriptionKey][skill.name]) {
          acc[descriptionKey][skill.name].dragonsWithSkill += 1;
        } else {
          acc[descriptionKey] = {
            ...acc[descriptionKey],
            [skill.name]: {
              name: skill.name,
              skillType: skill.skillType,
              dragonsWithSkill: 1,
            },
          };
        }
      }
    });
    return acc;
  }, {});
  const skillsByName = dragonsRaw.reduce((acc, curr) => {
    curr.skills.forEach((skill) => {
      acc[skill.name] = skill;
    });
    return acc;
  }, {});
  const uniqueSkills = Object.values(skillsByName).map((skill) => ({
    name: skill.name === "" ? "Produce Food" : skill.name,
    skillType: skill.skillType,
    description: skill.descriptionKey,
  }));
  return { uniqueSkills, skillsByName, skillByDescription };
}

function getAllFamilies(dragonsRaw) {
  const families = {};
  dragonsRaw.reduce((acc, curr) => {
    if (curr.familyIcon) {
      acc[curr.familyIcon]
        ? (acc[curr.familyIcon] = {
            ...acc[curr.familyIcon],
            [curr.rarity]: acc[curr.familyIcon][curr.rarity]
              ? acc[curr.familyIcon][curr.rarity] + 1
              : 1,
            total: acc[curr.familyIcon]["total"] + 1,
          })
        : (acc[curr.familyIcon] = {
            [curr.rarity]: 1,
            total: 1,
          });
    }
    return acc;
  }, families);
  return families;
}

function getMetadata(dragonsRaw) {
  const skills = getAllSkills(dragonsRaw);
  const families = getAllFamilies(dragonsRaw);
  const maxSpeed = Math.max(...dragonsRaw.map((dragon) => dragon.maxSpeed));
  const minSpeed = Math.min(...dragonsRaw.map((dragon) => dragon.baseSpeed));
  const maxDamage = Math.max(...dragonsRaw.map((dragon) => dragon.maxDamage));
  const minDamage = Math.min(...dragonsRaw.map((dragon) => dragon.maxDamage));
  return { skills, families, maxSpeed, minSpeed, maxDamage, minDamage };
}

async function seedDragons(dragons) {
  console.log(`Start seeding dragons...`);
  for (const dragon of dragons) {
    await prisma.dragons.upsert({
      where: { dragonId: dragon.dragonId },
      create: {
        ...dragon,
        skills: {
          connectOrCreate: dragon.skills.map((skill) => ({
            where: {
              name: skill.name,
            },
            create: skill,
          })),
        },
      },
      update: {
        ...dragon,
        skills: {
          connectOrCreate: dragon.skills.map((skill) => ({
            where: {
              name: skill.name,
            },
            create: skill,
          })),
        },
      },
    });
    console.log(`Created/Updated dragon: ${dragon.name}`);
  }
  console.log(`Seeding finished. ${dragons.length} Dragons seeded.`);
}

async function main() {
  const { dragons, metadata } = await fetchDragons({});
  const dragonsWithScores = dragons.map((dragon) => {
    return {
      ...dragon,
      speedScore: dragonSpeedScore(
        dragon,
        metadata.minSpeed,
        metadata.maxSpeed
      ),
      damageScore: dragonDamageScore(
        dragon,
        metadata.minDamage,
        metadata.maxDamage
      ),
      elementsScore: dragonElementsScores(dragon),
      rarityScore: RarityScores[dragon.rarity],
      skillsScore: dragonSkillScores(dragon),
    };
  });
  const dragonsWithFinalScore = dragonsWithScores.map((dragon) => {
    return {
      ...dragon,
      dragonScore: dragonTotalScore(dragon),
    };
  });
  const dragonsWithRank = dragonsWithFinalScore
    .sort((a, b) => b.dragonScore - a.dragonScore)
    .map((dragon, index) => {
      return {
        ...dragon,
        rank: index,
      };
    });
  // console.log(JSON.stringify(dragonsWithRank, null, 2));
  seedDragons(dragonsWithRank);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
