import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
import {
  getDragonElementWeaknesses,
  getDragonElementStrengths,
} from "./updateTypes.mjs";
const prisma = new PrismaClient();

const dragonSkinThumbnailCorrections = {
  "Norn Skill Skin":
    "/dragons/HD/thumb_3109_dragon_highredemptionnorn_skin3_b_3.png",
};

const dragonSkinImageCorrections = {};

async function readJsonFile(filePath) {
  try {
    // Read the file content
    const fileContent = await fs.readFile(filePath, "utf-8");

    // Parse and return the JSON data
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    throw error;
  }
}

const getImages = (code) => {
  //3 is adult
  const image = `/dragons/ui_${code}@2x.png`;
  const thumbnail = `/dragons/HD/thumb_${code}.png`;
  return { image, thumbnail };
};

const getFamilyName = (family) => {
  const familyNameCorrections = {
    vampire: "Vampire",
    dual: "Dual",
    corrupted: "Corrupted",
    quantum: "Quantum",
    karma: "Karma",
    titan: "Titan",
    arcana: "Arcana",
    plasma: "Plasma Colony",
    extractor: "Extractor",
    berserk: "Berserker",
    ascended: "Ascended",
    eternal: "Eternal",
    spikes: "Spiked",
    twd: "Walking Dead",
    redemption: "Redemption",
    strategist: "Strategist",
    evader: "Evader",
    guard: "Guardian",
    Critical: "Crit Crew",
  };

  const dragonFamily =
    familyNameCorrections[family] !== undefined
      ? familyNameCorrections[family]
      : family;

  return dragonFamily;
};

const getBreedable = (BOOK) => {
  return (
    BOOK["SOURCES"].includes("breedable") ||
    BOOK["SOURCES"].includes("breeding_sanctuary")
  );
};

const getSkins = (IMAGES) => {
  const skins = [];

  for (const key in IMAGES) {
    if (key.startsWith("skin_")) {
      const { NAME, DESC = "", CODE } = IMAGES[key];
      let description = DESC;
      // Modify the description
      const marker = " Please restart your game for this to take effect.";
      const marker2 = "By simply owning this Skin,";

      if (description.includes(marker) || description.includes(marker2)) {
        description = description
          .replace(marker, "")
          .replace("By simply owning this Skin, your dragon will", "")
          .replace("By simply owning this Skin, your dragon's", "")
          .trim();
      } else {
        description = "";
      }

      // Capitalize the first letter of the modified description
      if (description) {
        description = description[0].toUpperCase() + description.slice(1);
      }
      const { image, thumbnail } = getImages(CODE);
      skins.push({ skinname: NAME, descr: description, image, thumbnail });
    }
  }

  return skins;
};

function parseSkills(skills) {
  return skills.flatMap((skill) => {
    const parsedSkill = {
      name: skill.NAME,
      description: skill.DESC,
      skillType: skill.SKILL_TYPE,
      cooldown: skill.COOLDOWN ?? -1,
    };

    const foodProducerSkill =
      skill.WORLD &&
      skill.WORLD.TYPE === "RESOURCE_PRODUCTION" &&
      skill.WORLD.RESOURCE === "f"
        ? {
            name: "Food Production",
            description: "",
            skillType: -1,
            cooldown: -1,
          }
        : null;
    const skills = [];
    if (foodProducerSkill) {
      skills.push(foodProducerSkill);
    }
    if (!parsedSkill.name.startsWith("tid_")) {
      skills.push(parsedSkill);
    }
    return skills;
  });
}

const transformData = (data, filterUnreleased = true) => {
  const dragonArray = Object.values(data);
  const dragons = dragonArray
    .filter((dragon) => {
      if (filterUnreleased) {
        const { BOOK } = dragon;
        return BOOK.RELEASE.TIMESTAMP === 0;
      }
      return true;
    })
    .map((dragon) => {
      const {
        ID,
        BOOK,
        ELEMENTS: elements,
        INFO,
        IMAGES,
        SKILLS = [],
        SKILL_TYPE: skillType,
        TID_NAME,
        TID_DESC,
      } = dragon;
      const {
        RARITY: rarity,
        FAMILY,
        SPEED,
        CATEGORY: category,
        BASE_STATS,
      } = INFO;
      const { image, thumbnail } = getImages(IMAGES["3"].CODE);
      const familyName = getFamilyName(FAMILY);
      const skills = parseSkills(SKILLS);
      const hasSkills = skills.length > 0;
      return {
        name: TID_NAME.trim(),
        description: TID_DESC,
        code: ID,
        rarity,
        releaseDate: BOOK.RELEASE.TIMESTAMP
          ? new Date(BOOK.RELEASE.TIMESTAMP * 1000)
          : null,
        createdAt: BOOK.RELEASE.TIMESTAMP
          ? new Date(BOOK.RELEASE.TIMESTAMP * 1000)
          : null,
        elements,
        image,
        thumbnail,
        familyName,
        baseLife: BASE_STATS.LIFE,
        baseAttack: BASE_STATS.ATTACK,
        baseSpeed: SPEED[0],
        maxSpeed: SPEED[1],
        breedable: getBreedable(BOOK),
        category,
        weak: getDragonElementWeaknesses(elements),
        strong: getDragonElementStrengths(elements),
        isVip: !!familyName && hasSkills,
        isSkin: false,
        hasAllSkins: false,
        skins: getSkins(IMAGES), // you get name description from images object from master file
        skillType,
        hasSkills,
        skills,
      };
    });

  const dragonsAndSkins = dragons.reduce((acc, curr) => {
    if (curr.skins) {
      const skillSkins = curr.skins.filter((skin) => !!skin.descr);

      delete curr.skins;
      const skinDragons = skillSkins.map((skin) => {
        return {
          ...curr,
          name: `${curr.name} (${skin.skinname})`,
          image: dragonSkinImageCorrections[skin.skinname] ?? skin.image,
          thumbnail:
            dragonSkinThumbnailCorrections[skin.skinname] ?? skin.thumbnail,
          isSkin: true,
          skinName: skin.skinname,
          skinDescription: skin.descr,
          originalDragonName: curr.name,
        };
      });
      if (skinDragons.length > 1) {
        const allSkillsDescr = skillSkins.map((skin) => skin.descr).join("||");
        return [
          ...acc,
          curr,
          ...skinDragons,
          {
            ...curr,
            name: `${curr.name} (All Skins)`,
            skinName: "All Skins",
            isSkin: true,
            hasAllSkins: true,
            skinDescription: allSkillsDescr,
            originalDragonName: curr.name,
          },
        ];
      } else if (skinDragons.length > 0) {
        return [...acc, curr, ...skinDragons];
      }
    }
    return [...acc, curr];
  }, []);
  return dragonsAndSkins;
};
const filterData = (data) => {
  return data.filter((d) => {
    return (
      !d.name.startsWith("tid_") &&
      !d.name.includes(" Test") &&
      !d.name.includes("???") &&
      !d.name.includes("Copy") &&
      !d.name.includes("Chest") &&
      !d.name.includes("Dragoonie") &&
      d.code > 2222
    );
  });
  // .filter((d) => d.hasSkills);
};

const writeData = (data) => {
  seedDragons(data);
};

async function main() {
  try {
    // Define the path to the JSON file
    const folderPath = "./temp";
    const fileName = "dragons.formatted.json";
    const filePath = path.join(folderPath, fileName);

    // Read the JSON file
    const dragonData = await readJsonFile(filePath);
    const transformedData = transformData(dragonData, true);
    const filteredData = filterData(transformedData);
    writeData(filteredData);
    // writeVipDragonsToAFile(filePath);
    // exportElements();
  } catch (error) {
    console.error("An error occurred in main:", error);
  }
}

const writeVipDragonsToAFile = async (filePath) => {
  const dragonData = await readJsonFile(filePath);
  const dragonArray = Object.values(dragonData);
  const filteredDragons = dragonArray.filter((dragon) => {
    const { INFO, SKILLS = [] } = dragon;
    const { FAMILY } = INFO;
    const familyName = getFamilyName(FAMILY);
    const skills = parseSkills(SKILLS);
    const hasSkills = skills.length > 0;
    return !!familyName && hasSkills;
  });
  writeJsonToFile(filteredDragons, "./temp/vipdragons.formatted.json");
};

async function exportRatings() {
  const ratings = await prisma.rating.findMany({
    include: {
      dragons: {
        select: {
          name: true,
          rarity: true,
        },
      },
    },
  });

  // Transform data to replace dragonsId with dragonName
  const formattedRatings = ratings.map(({ dragonsId, dragons, ...rest }) => ({
    ...rest,
    name: dragons?.name || "Unknown", // Handle cases where dragon may be null
    dragonRarity: dragons?.rarity || "Unknown", // Handle cases where dragon may be null
  }));

  writeJsonToFile(formattedRatings, "./temp/ratings.json");
}

async function exportElements() {
  const ratings = await prisma.dragons.findMany({
    where: {
      hasSkills: true,
    },
    select: {
      id: true,
      name: true,
      strong: true,
      weak: true,
    },
  });
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
  // Transform data to replace dragonsId with dragonName
  const formattedElements = ratings.map(({ strong, weak, ...rest }) => ({
    ...rest,
    strong: strong.map((el) => ElementsNames[el]),
    weak: weak.map((el) => ElementsNames[el]),
  }));

  writeJsonToFile(formattedElements, "./temp/elements.json");
}

/**
 * Writes JSON data to a file.
 *
 * @param {Object} data - The JSON data to write.
 * @param {string} filePath - The path to the file where the data should be written.
 */
async function writeJsonToFile(data, filePath) {
  try {
    const jsonData = JSON.stringify(data, null, 4); // Convert JSON to string with pretty formatting
    await fs.writeFile(filePath, jsonData, "utf-8");
    console.log(`JSON data has been written to ${filePath}`);
  } catch (error) {
    console.error(
      `An error occurred while writing to the file: ${error.message}`
    );
  }
}

export async function seedDragons(dragons) {
  console.log(`Start seeding dragons...`);
  const updatedDragons = [];
  for (const dragon of dragons) {
    const updatedDragon = await prisma.dragons.upsert({
      where: { name: dragon.name },
      create: {
        ...dragon,
        skills: {
          connectOrCreate: dragon.skills.map((skill) => ({
            where: {
              name_cooldown: {
                name: skill.name,
                cooldown: skill.cooldown,
              },
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
              name_cooldown: {
                name: skill.name,
                cooldown: skill.cooldown,
              },
            },
            create: skill,
          })),
        },
      },
    });

    if (dragon.isSkin) {
      console.log(`Created/Updated Skinned Dragon: ${dragon.name}`);
      updatedDragons.push({
        name: updatedDragon.name,
        image: `https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui${updatedDragon.thumbnail}`,
        id: updatedDragon.id,
      });
    } else {
      console.log(`Created/Updated Dragon: ${dragon.name}`);
      updatedDragons.push({
        name: updatedDragon.name,
        image: `https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui${updatedDragon.thumbnail}`,
        id: updatedDragon.id,
      });
    }
  }
  const dragonsLength = dragons.filter((dragon) => !dragon.isSkin).length;
  const skinsLength = dragons.filter(
    (dragon) => dragon.isSkin && !dragon.hasAllSkins
  ).length;
  const allSkinsLength = dragons.filter((dragon) => dragon.hasAllSkins).length;
  const message = `Seeding finished.
     ${dragonsLength} Dragons seeded.
     ${skinsLength} Combat Skins seeded.
     ${allSkinsLength} All Skin dragons seeded.`;
  console.log(message);
  addDiscordDragonUpdatesWebhook(message, updatedDragons);
}

// Call the main function
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
