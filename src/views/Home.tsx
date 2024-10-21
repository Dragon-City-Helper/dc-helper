"use client";

import DragonsTable from "@/components/DragonsTable";
import { HomeDragons } from "@/services/dragons";
import { useMemo, useOptimistic, useState } from "react";
import DragonFilters from "@/components/DragonFilters";
import useDragonFilters from "@/hooks/useDragonFilters";
import { IFilters } from "@/types/filters";
import { setOwnedIds } from "@/services/owned";
import { captureException } from "@sentry/nextjs";

export default function Home({
  dragons,
  owned,
}: {
  dragons: HomeDragons;
  owned: string[];
}) {
  const [loading, setLoading] = useState<boolean | string>(false);
  const [ownedIds, setOwned] = useState<string[]>(owned);

  const ownedIdsMap = useMemo(() => {
    return ownedIds.reduce((acc, curr) => {
      acc.set(curr, true);
      return acc;
    }, new Map<string, boolean>());
  }, [ownedIds]);

  const onOwned = async (dragonId: string, checked: boolean) => {
    try {
      let newOwned = owned;
      if (checked) {
        newOwned = [...owned, dragonId];
      } else {
        newOwned = owned.filter((id) => id != dragonId);
      }
      setLoading(dragonId);
      await setOwnedIds(newOwned);
      setOwned(newOwned);
      setLoading(false);
    } catch (error) {
      setOwned(owned);
      setLoading(false);
    }
  };

  const { filteredDragons, onFilterChange, filters } = useDragonFilters(
    dragons,
    ownedIdsMap,
  );

  const allowedFilters: (keyof IFilters)[] = [
    "search",
    "element",
    "familyName",
    "rarity",
    "skins",
    "vip",
    // "skill",
  ];

  if (owned.length > 0) {
    allowedFilters.push("show");
  }
  return (
    <div className="flex flex-row w-100 h-100 overflow-auto">
      <div className="flex-1 m-6">
        <div className="flex flex-col gap-4">
          <DragonFilters
            onFilterChange={onFilterChange}
            filters={filters}
            dragons={dragons}
            allowedFilters={allowedFilters}
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
            viewOnly={owned.length <= 0}
            dragons={filteredDragons as HomeDragons}
            onOwned={onOwned}
            ownedIdsMap={ownedIdsMap}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
