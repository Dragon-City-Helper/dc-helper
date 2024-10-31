import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getImageUrl = ({ image, isThumbnail }) => {
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
    "",
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
  const ditlepResponse = await axios.post(
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
    },
  );

  const dcMetaResponse = await axios.get(
    "https://dragoncitymeta.com/calculate-tier/t-all-nonee",
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const dcMetaResponseByName = dcMetaResponse.data.reduce((acc, curr) => {
    const name = (nameCorrections[curr.dragon.name] ?? curr.dragon.name).trim();
    return {
      ...acc,
      [name]: curr,
    };
  }, {});

  const dragons = ditlepResponse.data.items
    .filter(
      ({ id }) =>
        ![1145, 1146, 1144, 1410, 1882, 1911, 1920, 1921, 1852, 1114].includes(
          id,
        ),
    )
    .filter(({ name }) => !!dcMetaResponseByName[name.trim()])
    .map(
      ({
        name,
        rarity,
        breedable,
        elements,
        baseSpeed,
        maxSpeed,
        maxDamage,
        skills,
        skillType,
        hasSKill,
        category,
        image,
      }) => {
        const trimmedName = name.trim();
        const { dragon } = dcMetaResponseByName[trimmedName];
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
          maxDamage,
          category,
          skills: skills.map((skill) => ({
            name: skill.name === "" ? "Produce Food" : skill.name,
            skillType: skill.skillType === 0 ? 3 : skill.skillType,
            description: skill.descriptionKey,
          })),
          skins: dragon.skins,
          image: filterHostUrl(dragon.image),
          thumbnail: getImageUrl({ image, isThumbnail: true }),
          isVip: !!dragonFamily && (skills?.length ?? 0) > 0,
          hasSkills: hasSKill,
          skillType,
          isSkin: false,
          hasAllSkins: false,
        };
      },
    );
  return dragons;
};

async function seedDragons(dragons) {
  console.log(`Start seeding dragons...`);
  for (const dragon of dragons) {
    await prisma.dragons.upsert({
      where: { name: dragon.name },
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

    if (dragon.isSkin) {
      console.log(`Created/Updated Skinned Dragon: ${dragon.name}`);
    } else {
      console.log(`Created/Updated Dragon: ${dragon.name}`);
    }
  }
  const dragonsLength = dragons.filter((dragon) => !dragon.isSkin).length;
  const skinsLength = dragons.filter(
    (dragon) => dragon.isSkin && !dragon.hasAllSkins,
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
        console.log("\n\n");
        console.log(`${curr.name} (${skin.skinname})`);
        console.log(parsedSkinDescr);
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
          skinPrice: skin.price,
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
                .replace(/\|\|\s*$/, ""), // Remove the last "||" and any trailing whitespace
          )
          .join("||");
        console.log("\n\n");
        console.log(`${curr.name} (All Skins)`);
        console.log(allSkillsDescr);
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
  seedDragons(dragonsAndSkins);
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
