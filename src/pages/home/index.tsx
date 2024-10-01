import DragonsTable from "@/components/DragonsTable";
import { fetchDragons } from "@/services/dragons";
import { getOwned, postOwned } from "@/services/ownedDragons";
import { useEffect, useMemo, useState } from "react";
import { dragons, Elements, Rarity } from "@prisma/client";
import DragonFilters from "@/components/DragonFilters";
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

export interface IFilters {
  search?: string;
  show: "all" | "owned" | "unowned";
  rarity?: Rarity | "all";
  element?: Elements | "all";
}

const defaultFilters: IFilters = {
  show: "all",
};

export default function Page({ dragons }: { dragons: dragons[] }) {
  const [owned, setOwned] = useState<string[]>([]);
  const [allDragons] = useState<dragons[]>(dragons);
  const [loading, setLoading] = useState<boolean | string>(true);
  const [filters, setFilters] = useState<IFilters>(defaultFilters);
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

  const filteredDragons = useMemo(() => {
    let finalDragons = allDragons;
    if (filters.search) {
      finalDragons = finalDragons.filter((dragon) =>
        new RegExp(`${filters.search}`, "gi").test(dragon.name)
      );
    }
    if (filters.rarity && filters.rarity !== "all") {
      finalDragons = finalDragons.filter(
        (dragon) => dragon.rarity === filters.rarity
      );
    }
    if (filters.element && filters.element !== "all") {
      finalDragons = finalDragons.filter((dragon) =>
        dragon.elements.includes(filters.element as Elements)
      );
    }
    switch (filters.show) {
      case "owned":
        finalDragons = finalDragons.filter((dragon) =>
          ownedIdsMap.has(dragon.id)
        );
        break;
      case "unowned":
        finalDragons = finalDragons.filter(
          (dragon) => !ownedIdsMap.has(dragon.id)
        );
      case "all":
      default:
        break;
    }
    return finalDragons;
  }, [
    allDragons,
    filters.element,
    filters.rarity,
    filters.search,
    filters.show,
    ownedIdsMap,
  ]);

  const onFilterChange = (key: keyof IFilters, e: any) => {
    setFilters({
      ...filters,
      [key]: e.target.value,
    });
  };

  return (
    <div className="flex flex-row w-100 h-100 overflow-auto">
      <div className="flex-1 m-6">
        <div className="flex flex-col gap-4">
          <DragonFilters onFilterChange={onFilterChange} filters={filters} />
          <b>
            {filteredDragons.length === dragons.length
              ? `Showing all Dragons`
              : `Showing ${filteredDragons.length} of ${dragons.length} dragons`}
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
