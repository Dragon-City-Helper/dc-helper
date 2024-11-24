import fs from "fs/promises";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { seedDragons } from "./seed.mjs";
const prisma = new PrismaClient();

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
      cooldown: skill.COOLDOWN || null,
    };

    const foodProducerSkill =
      skill.WORLD &&
      skill.WORLD.TYPE === "RESOURCE_PRODUCTION" &&
      skill.WORLD.RESOURCE === "f"
        ? {
            name: "Food Production",
            description: "",
            skillType: -1,
            cooldown: null,
          }
        : null;

    return foodProducerSkill ? [foodProducerSkill, parsedSkill] : [parsedSkill];
  });
}

const transformData = (data) => {
  const dragonArray = Object.values(data);
  const dragons = dragonArray.map((dragon) => {
    const {
      ID,
      BOOK,
      ELEMENTS: elements,
      INFO,
      IMAGES,
      SKILLS = [],
      WEAKNESS: weak,
      STRONGEST: strong,
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
      name: TID_NAME,
      description: TID_DESC,
      code: ID,
      rarity,
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
      weak,
      strong,
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
          image: skin.image,
          isSkin: true,
          thumbnail: skin.thumbnail,
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
  return data.filter((d) =>
    [
      // "High Tectonic Dragon (Tectonic Talisman)",
      // "Spiked Pegasus Dragon (Spiked Pegasus Skill Skin)",
      // "Spiked Leatherback Dragon (Spiked Leatherback Skill Skin)",
      // "Leaderbliss Dragon (Royale Leader Skill Skin)",
      // "Spiked Raptor Dragon (Spiked Raptor Skill Skin)",
      "High Super Dragon",
      "Aquarelle Dragon",
      "Ice Hockey Dragon",
      "Jewel Dragon",
      "Happy Egg Dragon",
      "Terraformer Dragon",
      "Third Birthday Dragon",
      "Neo-Izumi Dragon",
      "Crest Dragon",
      "Neo-Akimori Dragon",
    ].includes(d.name),
  );
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
    const transformedData = transformData(dragonData);
    const filteredData = filterData(transformedData);
    writeData(filteredData);
  } catch (error) {
    console.error("An error occurred in main:", error);
  }
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
