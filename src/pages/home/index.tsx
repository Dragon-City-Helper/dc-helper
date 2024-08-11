import DragonsTable from "@/components/DragonsTable";
import { IDragonSimple } from "@/types/Dragon";
import fetchDragons from "@/utils/fetchDragons";
import { fetchOwned, postOwned } from "@/utils/manageOwned";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [owned, setOwned] = useState<number[]>(ownedIds);
  const [allDragons] = useState<IDragonSimple[]>(dragons);
  const [filteredDragons, setFilteredDragons] =
    useState<IDragonSimple[]>(dragons);
  const [search, setSearch] = useState<string>("");
  const ownedIdsMap = useMemo(() => {
    return owned.reduce((acc, curr) => {
      acc.set(curr, true);
      return acc;
    }, new Map<number, boolean>());
  }, [owned]);

  const onOwned = (dragon: IDragonSimple, checked: boolean) => {
    try {
      let newOwned = owned;
      if (checked) {
        newOwned = [...owned, dragon.id];
      } else {
        newOwned = owned.filter((id) => id != dragon.id);
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
          Search
          <div>
            <input
              type="text"
              className="grow"
              placeholder="Search by name"
              onChange={onSearchChange}
            />
          </div>
        </div>
        <DragonsTable
          dragons={filteredDragons}
          onOwned={onOwned}
          ownedIdsMap={ownedIdsMap}
          compact={false}
        ></DragonsTable>
      </div>
    </div>
  );
}
