import { IDragon, IDragonSimple } from "@/types/Dragon";
import axios from "axios";

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
  const dragons: IDragonSimple[] = (data.items as IDragon[]).map(
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
  return dragons;
};

export default fetchDragons;
