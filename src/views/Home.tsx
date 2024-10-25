"use client";

import DragonsGrid from "@/components/DragonGrid";
import { HomeDragons } from "@/services/dragons";
import { useCallback, useEffect, useMemo, useState } from "react";
import DragonFilters from "@/components/DragonFilters";
import useDragonFilters from "@/hooks/useDragonFilters";
import { IFilters } from "@/types/filters";
import { setOwnedIds } from "@/services/owned";

const TAKE = 48; // Number of items to fetch each time
export default function Home({
  initialDragons,
  owned,
}: {
  initialDragons: HomeDragons;
  owned: string[];
}) {
  const [loading, setLoading] = useState<string>();
  const [infiniteLoading, setInfiniteLoading] = useState<boolean>(false);
  const [ownedIds, setOwned] = useState<string[]>(owned);
  const [dragons, setDragons] = useState(initialDragons);
  const [hasMore, setHasMore] = useState(initialDragons.length === TAKE);
  const [filters, setFilters] = useState<IFilters>({});

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
      setLoading(undefined);
    } catch (error) {
      setOwned(owned);
      setLoading(undefined);
    }
  };

  const loadMoreDragons = useCallback(
    async (reset = false) => {
      if (infiniteLoading || (!hasMore && !reset)) return;
      setInfiniteLoading(true);
      const skip = reset ? 0 : dragons.length;
      const params = new URLSearchParams();
      params.append("skip", skip.toString());
      params.append("take", TAKE.toString());
      // Build params with filters
      if (filters.rarity) params.append("rarity", filters.rarity);
      if (filters.element) params.append("element", filters.element);
      if (filters.familyName) params.append("familyName", filters.familyName);
      if (filters.search) params.append("search", filters.search);
      if (filters.vip === "vip") params.append("isVip", "true");
      if (filters.vip === "normal") params.append("isVip", "false");
      if (filters.skins === "skins") params.append("isSkin", "true");
      if (filters.skins === "dragons") params.append("isSkin", "false");
      if (filters.skill) {
        switch (filters.skill) {
          case "any":
            params.append("hasSkills", "true");
            break;
          case "no":
            params.append("hasSkills", "false");
            break;
          case "ps":
            params.append("skillType", "3");
            break;
          case "as":
            params.append("skillType", "1");
            break;
          case "aps":
            params.append("skillType", "2");
            break;
          default:
            break;
        }
      }

      const response = await fetch(`/api/dragons?${params.toString()}`);
      const newDragons = await response.json();

      if (reset) {
        setDragons(newDragons);
      } else {
        setDragons((prevDragons) => [...prevDragons, ...newDragons]);
      }

      // Update hasMore based on whether we received the full batch
      setHasMore(newDragons.length === TAKE);
      setInfiniteLoading(false);
    },
    [
      infiniteLoading,
      hasMore,
      dragons.length,
      filters.rarity,
      filters.element,
      filters.familyName,
      filters.search,
      filters.vip,
      filters.skins,
      filters.skill,
    ],
  );

  useEffect(() => {
    loadMoreDragons(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        !infiniteLoading &&
        hasMore
      ) {
        loadMoreDragons();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [infiniteLoading, hasMore, loadMoreDragons]);

  // Use the useDragonFilters hook for client-side filtering (e.g., "owned" status)
  const {
    filteredDragons,
    onFilterChange: onClientFilterChange,
    isClientOnlyFilter,
  } = useDragonFilters(dragons, ownedIdsMap);

  const onFilterChange = (key: keyof IFilters, value: any) => {
    setFilters({
      ...filters,
      [key]: value,
    });
    if (isClientOnlyFilter(key)) {
      onClientFilterChange(key, value);
    }
  };

  const allowedFilters: (keyof IFilters)[] = [
    "search",
    "element",
    "familyName",
    "rarity",
    "skins",
    "vip",
    "skill",
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
          <DragonsGrid
            dragons={filteredDragons as HomeDragons}
            onOwned={owned.length > 0 ? onOwned : undefined}
            ownedIdsMap={ownedIdsMap}
            loading={loading}
            infiniteLoading={infiniteLoading}
          />
        </div>
      </div>
    </div>
  );
}
