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
  const dragonsSimple: IDragonSimple[] = (data.items as IDragon[]).map(
    ({ name, id, rank, rarity, familyName, breedable, elements }: IDragon) => ({
      name,
      id,
      ...rank,
      rarity,
      familyName,
      breedable,
      elements,
    })
  );
  kv.set("dragonsSimple", dragonsSimple);
  return dragonsSimple;
};

export default fetchDragons;
