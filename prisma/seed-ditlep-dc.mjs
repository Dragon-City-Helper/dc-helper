import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getImageUrl = ({ image, isThumbnail }) => {
  // const host =
  //   "https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui";
  if (isThumbnail) {
    return `/${image.replace("/ui_", "/HD/thumb_")}_3.png`;
  }
  return `/${image}_3@2x.png`;
};

function convertToThumbnailUrl(imageUrl) {
  // Replace the path and remove the "@2x" at the end
  return imageUrl
    .replace("/ui/dragons/ui_", "/ui/dragons/HD/thumb_")
    .replace("@2x.png", ".png");
}

function filterHostUrl(image) {
  return image.replace(
    "https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui",
    ""
  );
}

const nameCorrections = {
  "Spiked Ghoul Dragon": "Spiky Ghoul Dragon",
};

const dragonSkinThumbnailCorrections = {
  "Norn Skill Skin":
    "/dragons/HD/thumb_3109_dragon_highredemptionnorn_skin3_b_3.png",
  "Blood Skill Skin":
    "/dragons/HD/thumb_2788_dragon_highvoodoovampire_skin1_b_3.png",
};

const dragonSkinImageCorrections = {
  "Blood Skill Skin":
    "/dragons/ui_2788_dragon_highvoodoovampire_skin1_b_3@2x.png",
};

const rarityToBaseLife = {
  H: 24000,
  M: 16500,
  L: 15000,
  E: 14000,
  V: 12000,
  R: 10000,
  C: 8000,
};
const rarityToBaseDamage = {
  H: 9000,
  M: 7300,
  L: 6000,
  E: 5600,
  V: 4800,
  R: 4000,
  C: 3200,
};

const familyNameCorrections = {
  ability: null,
  abilityy: null,
  abilityyskin: null,
  skin: null,
  "skin-vampire": null,
  Redemption1: "Redemption",
  Redemption2: "Redemption",
  PlasmaR: "Plasma Colony",
  Plasma: "Plasma Colony",
  Critical: "Crit Crew",
};

const fetchDragons = async ({
  dragonName = "",
  rarities = [],
  elements = [],
  orderBy = 1,
  page = 0,
  pageSize = 5000,
  families = [],
  inStore = null,
  breedable = null,
  animation = null,
}) => {
  const ditlepResponse = await fetch("https://www.ditlep.com/Dragon/Search", {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    method: "POST",
    body: JSON.stringify({
      dragonName,
      rarities,
      elements,
      orderBy,
      page,
      pageSize,
      inStore,
      families,
      breedable,
      animation,
    }),
  });

  if (!ditlepResponse.ok) {
    throw new Error("Failed to fetch dragon data from Ditlep");
  }

  const ditlepData = await ditlepResponse.json();
  const dcMetaResponse = await fetch(
    "https://dragoncitymeta.com/calculate-tier/t-all-nonee",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!dcMetaResponse.ok) {
    throw new Error("Failed to fetch tier data from Dragon City Meta");
  }

  const dcMetaData = await dcMetaResponse.json();

  const dcMetaResponseById = dcMetaData.reduce((acc, curr) => {
    const name = curr.dragon.dragon_Id;
    return {
      ...acc,
      [name]: curr,
    };
  }, {});
  const dragons = ditlepData.items
    .filter(
      ({ id }) =>
        [3373, 3346, 3347, 3345, 3375, 3343, 3344, 3333].includes(id) &&
        !!dcMetaResponseById[id.toString()]
    )
    .map(
      ({
        id,
        name,
        rarity,
        breedable,
        elements,
        baseSpeed,
        maxSpeed,
        weaknessElements,
        strongElements,
        skills,
        skillType,
        hasSKill,
        category,
        image,
        releaseDate,
      }) => {
        const trimmedName = name.trim();
        const { dragon } = dcMetaResponseById[id.toString()];
        const dragonFamily =
          familyNameCorrections[dragon.family] !== undefined
            ? familyNameCorrections[dragon.family]
            : dragon.family;
        return {
          name: trimmedName,
          rarity,
          familyName: dragonFamily,
          breedable,
          elements,
          baseSpeed,
          maxSpeed,
          category,
          code: id,
          releaseDate,
          weak: weaknessElements,
          strong: strongElements,
          skills: skills.map((skill) => ({
            name: skill.name === "" ? "Produce Food" : skill.name,
            skillType: skill.skillType === 0 ? 3 : skill.skillType,
            description: skill.descriptionKey,
            cooldown: skill.cooldown ?? 3,
          })),
          skins: dragon.skins,
          description: dragon.descr,
          baseLife: dragon.boostHP
            ? rarityToBaseLife[rarity] * ((100 + dragon.boostHP) / 100)
            : rarityToBaseLife[rarity],
          baseAttack: dragon.boostATK
            ? rarityToBaseDamage[rarity] * ((100 + dragon.boostATK) / 100)
            : rarityToBaseDamage[rarity],
          image: filterHostUrl(dragon.image),
          thumbnail: getImageUrl({ image, isThumbnail: true }),
          isVip: !!dragonFamily && (skills?.length ?? 0) > 0,
          hasSkills: hasSKill,
          skillType,
          isSkin: false,
          hasAllSkins: false,
        };
      }
    );
  return dragons;
};
export async function seedDragons(dragons) {
  console.log(`Start seeding dragons...`);
  for (const dragon of dragons) {
    await prisma.dragons.upsert({
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
    } else {
      console.log(`Created/Updated Dragon: ${dragon.name}`);
    }
  }
  const dragonsLength = dragons.filter((dragon) => !dragon.isSkin).length;
  const skinsLength = dragons.filter(
    (dragon) => dragon.isSkin && !dragon.hasAllSkins
  ).length;
  const allSkinsLength = dragons.filter((dragon) => dragon.hasAllSkins).length;
  console.log(`Seeding finished.
    ${dragonsLength} Dragons seeded.
    ${skinsLength} Combat Skins seeded.
    ${allSkinsLength} All Skin dragons seeded.`);
}

async function main() {
  const dragons = await fetchDragons({});

  const dragonsAndSkins = dragons.reduce((acc, curr) => {
    if (curr.skins) {
      const skinsWithAbilities = curr.skins.filter((skin) => !!skin.descr);

      delete curr.skins;
      const skinDragons = skinsWithAbilities.map((skin) => {
        const parsedSkinDescr = skin.descr
          .replace(/\s*<\/li>\s*|\s*\/li>\s*/g, "||") // Replace only </li> or /li> with "||" and remove surrounding whitespace
          .replace(/\s*<li>\s*/g, "") // Remove <li> and surrounding whitespace
          .replace(/\s*<\/?ul>\s*/g, "") // Remove <ul>, </ul>, and surrounding whitespace
          .replace(/\s*-\s*/g, "") // Remove "- " and surrounding whitespace
          .replace(/\|\|\s*$/, ""); // Remove the last "||" and any trailing whitespace
        return {
          ...curr,
          name: `${curr.name} (${skin.skinname})`,
          image:
            dragonSkinImageCorrections[skin.skinname] ??
            filterHostUrl(skin.img),
          isSkin: true,
          thumbnail:
            dragonSkinThumbnailCorrections[skin.skinname] ??
            filterHostUrl(convertToThumbnailUrl(skin.img)),
          skinName: skin.skinname,
          skinDescription: parsedSkinDescr,
          originalDragonName: curr.name,
        };
      });
      if (skinDragons.length > 1) {
        const allSkillsDescr = skinsWithAbilities
          .map(
            (skin) =>
              skin.descr
                .replace(/\s*<\/li>\s*|\s*\/li>\s*/g, "||") // Replace only </li> or /li> with "||" and remove surrounding whitespace
                .replace(/\s*<li>\s*/g, "") // Remove <li> and surrounding whitespace
                .replace(/\s*<\/?ul>\s*/g, "") // Remove <ul>, </ul>, and surrounding whitespace
                .replace(/\s*-\s*/g, "") // Remove "- " and surrounding whitespace
                .replace(/\|\|\s*$/, "") // Remove the last "||" and any trailing whitespace
          )
          .join("||");
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
            skinPrice: "Obtain All Skins",
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
  const filteredDragons = dragonsAndSkins.filter((d) =>
    [3373, 3346, 3347, 3345, 3375, 3343, 3344, 3333].includes(d.code)
  );
  // console.log(filteredDragons);
  seedDragons(filteredDragons);
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
