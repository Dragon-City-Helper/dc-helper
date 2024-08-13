import DragonsTable from "@/components/DragonsTable";
import { fetchDragons } from "@/services/dragons";
import { fetchOwned, postOwned } from "@/services/ownedDragons";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [owned, setOwned] = useState<number[]>(ownedIds);
  const [allDragons] = useState<dragons[]>(dragons);
  const [filteredDragons, setFilteredDragons] = useState<dragons[]>(dragons);
  const [search, setSearch] = useState<string>("");
  const ownedIdsMap = useMemo(() => {
    return owned.reduce((acc, curr) => {
      acc.set(curr, true);
      return acc;
    }, new Map<number, boolean>());
  }, [owned]);

  const onOwned = (dragon: dragons, checked: boolean) => {
    try {
      let newOwned = owned;
      if (checked) {
        newOwned = [...owned, dragon.dragonId];
      } else {
        newOwned = owned.filter((id) => id != dragon.dragonId);
      }
      postOwned(newOwned);
      setOwned(newOwned);
    } catch (error) {
      console.log(error);
    }
  };

  const filterDragons = useCallback(
    ({ search }: { search: string }) => {
      if (!search) {
        setFilteredDragons(allDragons);
      } else {
        const filter = allDragons.filter((dragon) =>
          new RegExp(`${search}`, "gi").test(dragon.name)
        );
        setFilteredDragons(filter);
      }
    },
    [allDragons]
  );

  const onSearchChange = (e: any) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    filterDragons({ search });
  }, [filterDragons, search]);

  return (
    <div className="flex flex-row w-100 h-100 overflow-auto">
      <div className="flex-1 m-6">
        <div>
          <label>
            <p>Search</p>
            <input
              type="text"
              className="input input-bordered"
              placeholder="Search by name"
              onChange={onSearchChange}
            />
          </label>
        </div>
        <DragonsTable
          dragons={filteredDragons}
          onOwned={onOwned}
          ownedIdsMap={ownedIdsMap}
        ></DragonsTable>
      </div>
    </div>
  );
}
