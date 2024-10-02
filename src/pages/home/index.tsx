import DragonsTable from "@/components/DragonsTable";
import { fetchDragons } from "@/services/dragons";
import { getOwned, postOwned } from "@/services/ownedDragons";
import { useEffect, useMemo, useState } from "react";
import { dragons } from "@prisma/client";
import DragonFilters from "@/components/DragonFilters";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useDragonFilters from "@/hooks/useDragonFilters";

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
  const [owned, setOwned] = useState<string[]>([]);
  const [allDragons] = useState<dragons[]>(dragons);
  const [loading, setLoading] = useState<boolean | string>(true);

  const session = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session.status === "loading") {
      setLoading(true);
    } else if (session.status === "authenticated") {
      setLoading(true);
      getOwned(session.data?.user?.id || "").then((res) => {
        setOwned(res.data.dragons);
        setLoading(false);
      });
    } else {
      router.push("/api/auth/signin");
    }
  }, [router, session]);

  const ownedIdsMap = useMemo(() => {
    return owned.reduce((acc, curr) => {
      acc.set(curr, true);
      return acc;
    }, new Map<string, boolean>());
  }, [owned]);

  const onOwned = async (dragon: dragons, checked: boolean) => {
    try {
      let newOwned = owned;
      if (checked) {
        newOwned = [...owned, dragon.id];
      } else {
        newOwned = owned.filter((id) => id != dragon.id);
      }
      setLoading(dragon.id);
      await postOwned(session.data?.user?.id || "", newOwned);
      setOwned(newOwned);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const { filteredDragons, onFilterChange, filters } = useDragonFilters(
    dragons,
    ownedIdsMap
  );
  return (
    <div className="flex flex-row w-100 h-100 overflow-auto">
      <div className="flex-1 m-6">
        <div className="flex flex-col gap-4">
          <DragonFilters
            onFilterChange={onFilterChange}
            filters={filters}
            dragons={allDragons}
          />
          <b>
            {filteredDragons.length === dragons.length
              ? `Showing all Dragons and Skins`
              : `Showing ${
                  filteredDragons.filter((d) => !d.isSkin).length
                } of ${dragons.filter((d) => !d.isSkin).length} dragons and ${
                  filteredDragons.filter((d) => d.isSkin).length
                } of ${dragons.filter((d) => d.isSkin).length} Skins`}
          </b>
          <DragonsTable
            dragons={filteredDragons}
            onOwned={onOwned}
            ownedIdsMap={ownedIdsMap}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
