import TopDragonsCard from "@/components/TopDragonsCard";
import { IDragonSimple, rarities, Rarity } from "@/types/Dragon";
import fetchDragons from "@/utils/fetchDragons";
import { fetchOwned } from "@/utils/manageOwned";
import { useCallback, useMemo } from "react";

export async function getServerSideProps() {
  try {
    const dragons = await fetchDragons({});
    const ownedIds = await fetchOwned();

    return {
      props: {
        dragons,
        ownedIds,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

export default function Page({
  dragons,
  ownedIds,
}: {
  dragons: IDragonSimple[];
  ownedIds: number[];
}) {
  const ownedIdsMap = useMemo(() => {
    return ownedIds.reduce((acc, curr) => {
      acc.set(curr, true);
      return acc;
    }, new Map<number, boolean>());
  }, [ownedIds]);

  const getTotalRarityDragons = useCallback(
    (rarity: Rarity) => {
      return dragons.filter((dragon) => dragon.rarity === rarity).length;
    },
    [dragons]
  );
  const getTotalRarityDragonsOwned = useCallback(
    (rarity: Rarity) => {
      return dragons.filter(
        (dragon) => dragon.rarity === rarity && ownedIdsMap.has(dragon.id)
      ).length;
    },
    [dragons, ownedIdsMap]
  );
  return (
    <div className="flex flex-col gap-6">
      <div className="stats stats-vertical lg:stats-horizontal shadow">
        {rarities.map((rarity) => (
          <div className="stat" key={`stat-${rarity}`}>
            <div className="stat-title">{`Total ${Rarity[rarity]} Dragons`}</div>
            <div className="stat-value">{`${getTotalRarityDragonsOwned(
              rarity as Rarity
            )}/${getTotalRarityDragons(rarity as Rarity)}`}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        {rarities.map((rarity) => (
          <TopDragonsCard
            key={`card-${rarity}`}
            title={`My Top ${Rarity[rarity]} Dragons`}
            dragons={dragons}
            ownedIdsMap={ownedIdsMap}
            options={{ owned: true, size: 5, rarity }}
          />
        ))}
      </div>
    </div>
  );
}
