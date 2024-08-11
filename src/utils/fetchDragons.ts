import { IDragon, IDragonSimple } from "@/types/Dragon";
import axios from "axios";
import { kv } from "@vercel/kv";

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
  const dragons = await kv.get("dragonsSimple");
  if (dragons) {
    return dragons;
  }
  const { data } = await axios.post(
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
  const getImageUrl = ({
    image,
    isThumbnail,
  }: {
    image: string;
    isThumbnail: boolean;
  }) => {
    // https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui/dragons/HD/thumb_2607_dragon_hexedvampire_3.png
    const host =
      "https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui";
    if (isThumbnail) {
      return `${host}/${image.replace("/ui_", "/HD/thumb_")}_3.png`;
    }
    return `${host}/${image}_3@2x.png`;
  };
  const dragonsSimple: IDragonSimple[] = (data.items as IDragon[]).map(
    ({
      name,
      id,
      rank,
      rarity,
      familyName,
      breedable,
      elements,
      image,
    }: IDragon) => ({
      name,
      id,
      ...rank,
      rarity,
      familyName,
      breedable,
      elements,
      image: getImageUrl({ image, isThumbnail: false }),
      thumbnail: getImageUrl({ image, isThumbnail: true }),
    })
  );
  kv.set("dragonsSimple", dragonsSimple);
  return dragonsSimple;
};

export default fetchDragons;
