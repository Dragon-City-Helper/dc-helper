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

const fetchDragons = async ({
  dragonName = "",
  rarities = [],
  orderBy = 1,
  page = 0,
  pageSize = 3000,
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
      breedable,
      animation,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const dragonsSimple = response.data.items
    .filter(
      ({ id }) =>
        ![1145, 1146, 1144, 1410, 1882, 1911, 1920, 1921, 1852, 1114].includes(
          id
        )
    )
    .map(
      ({ name, id, rank, rarity, familyName, breedable, elements, image }) => ({
        name,
        dragonId: id,
        ...rank,
        rarity,
        familyName,
        breedable,
        elements,
        image: getImageUrl({ image, isThumbnail: false }),
        thumbnail: getImageUrl({ image, isThumbnail: true }),
      })
    );
  return dragonsSimple;
};

async function main() {
  console.log(`Start seeding ...`);
  const dragons = await fetchDragons({});
  for (const dragon of dragons) {
    const dragonRow = await prisma.dragons.upsert({
      where: { dragonId: dragon.dragonId },
      create: {
        ...dragon,
      },
      update: { ...dragon },
    });
    console.log(`Created/Updated dragon with id: ${dragonRow.dragonId}`);
  }
  console.log(`Seeding finished.`);
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
