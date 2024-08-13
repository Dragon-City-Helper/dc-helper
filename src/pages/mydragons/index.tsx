import TopDragonsCard from "@/components/TopDragonsCard";
import { fetchDragons } from "@/services/dragons";
import { fetchOwned } from "@/services/ownedDragons";
import { useCallback, useMemo } from "react";
import { dragons } from "@prisma/client";

export async function getServerSideProps() {
  try {
    const dragons = await fetchDragons();
    const { ids: ownedIds } = await fetchOwned();

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
  dragons: dragons[];
  ownedIds: number[];
}) {
  const ownedIdsMap = useMemo(() => {
    return ownedIds.reduce((acc, curr) => {
      acc.set(curr, true);
      return acc;
    }, new Map<number, boolean>());
  }, [ownedIds]);
  const totalOwnedBelowX = useCallback(
    (x: number) => {
      return dragons.filter(
        (dragon) => ownedIdsMap.has(dragon.dragonId) && dragon.globalRank <= x
      ).length;
    },
    [dragons, ownedIdsMap]
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="stats stats-vertical lg:stats-horizontal shadow">
        <div className="stat">
          <div className="stat-title">Total</div>
          <div className="stat-value">
            {ownedIds.length}/{dragons.length}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Below 100</div>
          <div className="stat-value">{totalOwnedBelowX(100)}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Below 500</div>
          <div className="stat-value">{totalOwnedBelowX(500)}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <TopDragonsCard
          title="My Top Dragons"
          dragons={dragons}
          ownedIdsMap={ownedIdsMap}
          options={{ owned: true, size: 13 }}
        />
        <TopDragonsCard
          title=" Top Dragons to breed"
          dragons={dragons}
          ownedIdsMap={ownedIdsMap}
          options={{ owned: false, breedable: true, size: 13 }}
        />
      </div>
    </div>
  );
}
