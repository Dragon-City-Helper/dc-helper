import TopDragonsCard from "@/components/TopDragonsCard";
import { fetchDragons } from "@/services/dragons";
import { getOwned } from "@/services/ownedDragons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { dragons } from "@prisma/client";
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
      router.push("/api/auth/signin");
    }
  }, [router, session]);

  const ownedIdsMap = useMemo(() => {
    return ownedIds.reduce((acc, curr) => {
      acc.set(curr, true);
      return acc;
    }, new Map<number, boolean>());
  }, [ownedIds]);

  const totalOwnedBelowX = useCallback(
    (x: number) => {
      return dragons.filter(
        (dragon) => ownedIdsMap.has(dragon.dragonId) && dragon.rank <= x
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
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              ownedIds.length
            )}
            /{dragons.length}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Below 100</div>
          <div className="stat-value">
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              totalOwnedBelowX(100)
            )}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Total Below 500</div>
          <div className="stat-value">
            {loading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              totalOwnedBelowX(500)
            )}
          </div>
        </div>
      </div>
      {ownedIds.length > 0 && (
        <div className="flex flex-wrap gap-4">
          <TopDragonsCard
            title="My Top Dragons"
            dragons={dragons}
            ownedIdsMap={ownedIdsMap}
            options={{ owned: true, size: 25 }}
          />
          <TopDragonsCard
            title="My Top Dragons Continued"
            dragons={dragons}
            ownedIdsMap={ownedIdsMap}
            options={{ owned: true, size: 25, offset: 25 }}
          />
          <TopDragonsCard
            title=" Top Dragons to breed"
            dragons={dragons}
            ownedIdsMap={ownedIdsMap}
            options={{ breedable: true, size: 25 }}
          />
        </div>
      )}
    </div>
  );
}
