import TopDragonsCard from "@/components/TopDragonsCard";
import { rarities, RarityNames } from "@/types/Dragon";
import { fetchDragons } from "@/services/dragons";
import { getOwned } from "@/services/ownedDragons";
import { useCallback, useMemo, useEffect, useState } from "react";
import { dragons, Rarity } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export async function getStaticProps() {
  try {
    const dragons = await fetchDragons();

    return {
      props: {
        dragons,
      },
      revalidate: 24 * 60 * 60,
    };
  } catch (error) {
    console.log(error);
  }
}

export default function Page({ dragons }: { dragons: dragons[] }) {
  const [ownedIds, setOwned] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session.status === "loading") {
      setLoading(true);
    } else if (session.status === "authenticated") {
      setLoading(true);
      getOwned(session.data?.user?.email || "").then((res) => {
        setOwned(res.data.ids);
        setLoading(false);
      });
    } else {
      router.push("/signin");
    }
  }, [router, session]);

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
        (dragon) => dragon.rarity === rarity && ownedIdsMap.has(dragon.dragonId)
      ).length;
    },
    [dragons, ownedIdsMap]
  );
  return (
    <div className="flex flex-col gap-6">
      <div className="stats stats-vertical lg:stats-horizontal shadow">
        {rarities.map((rarity) => (
          <div className="stat" key={`stat-${rarity}`}>
            <div className="stat-title">{`Total ${RarityNames[rarity]} Dragons`}</div>
            <div className="stat-value">
              {loading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                getTotalRarityDragonsOwned(rarity)
              )}
              /{getTotalRarityDragons(rarity)}
            </div>
          </div>
        ))}
      </div>
      {ownedIds.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {rarities.map((rarity) => (
            <TopDragonsCard
              key={`card-${rarity}`}
              title={`My Top ${RarityNames[rarity]} Dragons`}
              dragons={dragons}
              ownedIdsMap={ownedIdsMap}
              options={{ owned: true, size: 10, rarity }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
