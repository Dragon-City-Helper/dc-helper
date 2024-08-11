import TopDragonsCard from "@/components/TopDragonsCard";
import { elements, Elements, IDragonSimple } from "@/types/Dragon";
import fetchDragons from "@/utils/fetchDragons";
import fetchOwned from "@/utils/fetchOwned";
import { useMemo } from "react";

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
  return (
    <div className="flex vw-100 vh-100 flex-wrap gap-4">
      {elements.map((element) => (
        <TopDragonsCard
          key={element}
          title={`My Top ${Elements[element]} Dragons`}
          dragons={dragons}
          ownedIdsMap={ownedIdsMap}
          options={{ owned: true, size: 5, element }}
        />
      ))}
    </div>
  );
}
