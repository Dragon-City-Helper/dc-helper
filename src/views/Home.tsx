"use client";

import DragonsGrid from "@/components/DragonGrid";
import { HomeDragons } from "@/services/dragons";
import { useCallback, useEffect, useMemo, useState } from "react";
import DragonFilters from "@/components/DragonFilters";
import useDragonFilters from "@/hooks/useDragonFilters";
import { IFilters } from "@/types/filters";
import { toggleOwned } from "@/services/owned";
import FilterMessage, { IFilterMessageProps } from "@/components/FilterMessage";
import { useSession } from "next-auth/react";
import { useDebouncedCallback } from "@mantine/hooks";

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
  const [metadata, setMetadata] = useState<IFilterMessageProps["metadata"]>();
  const { status } = useSession();

  const ownedIdsMap = useMemo(() => {
    return ownedIds.reduce((acc, curr) => {
      acc.set(curr, true);
      return acc;
    }, new Map<string, boolean>());
  }, [ownedIds]);

  const onOwned = async (dragonId: string, checked: boolean) => {
    try {
      setLoading(dragonId);
      await toggleOwned(dragonId);
      setOwned((owned) => {
        if (checked) {
          return [...owned, dragonId];
        } else {
          return owned.filter((id) => id != dragonId);
        }
      });
      setLoading(undefined);
    } catch (error) {
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

      const response = await fetch(`/api/dragons?${params.toString()}`);
      const {
        dragons: newDragons,
        filterDragonsCount,
        filterSkinsCount,
        totalDragonsCount,
        totalSkinsCount,
        showMore,
      } = await response.json();

      setMetadata({
        filterDragonsCount,
        filterSkinsCount,
        totalDragonsCount,
        totalSkinsCount,
      });

      if (reset) {
        setDragons(newDragons);
      } else {
        setDragons((prevDragons) => [...prevDragons, ...newDragons]);
      }

      // Update hasMore based on whether we received the full batch
      setHasMore(showMore);
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

  const onFilterChange = useDebouncedCallback(
    (key: keyof IFilters, value: any) => {
      setFilters({
        ...filters,
        [key]: value,
      });
      if (isClientOnlyFilter(key)) {
        onClientFilterChange(key, value);
      }
    },
    500,
  );

  const allowedFilters: (keyof IFilters)[] = [
    "search",
    "element",
    "familyName",
    "rarity",
    "skins",
    "vip",
  ];

  if (status === "authenticated") {
    allowedFilters.push("show");
  }
  return (
    <div className="flex flex-col gap-4">
      <DragonFilters
        onFilterChange={onFilterChange}
        filters={filters}
        dragons={dragons}
        allowedFilters={allowedFilters}
        disabled={infiniteLoading || !!loading}
      />
      <FilterMessage metadata={metadata} />
      <DragonsGrid
        dragons={filteredDragons as HomeDragons}
        onOwned={status === "authenticated" ? onOwned : undefined}
        ownedIdsMap={ownedIdsMap}
        loading={loading}
        infiniteLoading={infiniteLoading}
      />
    </div>
  );
}
