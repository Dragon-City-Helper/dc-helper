"use client";

import { BaseDragons } from "@/services/dragons";
import RateDragonsTable from "@/components/RateDragonsTable";
import DragonFilters from "@/components/DragonFilters";
import { Rarity } from "@prisma/client";
import { useState, useCallback, useEffect } from "react";
import { IFilters } from "@/types/filters";
import { Center, Loader } from "@mantine/core";

export default function RateDragonsView({
  initialDragons,
  rarity,
}: {
  initialDragons: BaseDragons;
  rarity: Rarity;
}) {
  const [dragons, setDragons] = useState<BaseDragons>(initialDragons);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialDragons.length === 30);
  const [filters, setFilters] = useState<IFilters>({});
  const TAKE = 30; // Number of dragons to fetch per request

  const loadMoreDragons = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const skip = dragons.length;

    const params = new URLSearchParams();
    params.append("skip", skip.toString());
    params.append("take", TAKE.toString());
    params.append("rarity", rarity);

    // Append filters
    if (filters.search) params.append("search", filters.search);
    if (filters.element) params.append("element", filters.element);
    if (filters.familyName) params.append("familyName", filters.familyName);
    if (filters.skins) params.append("skins", filters.skins);

    const response = await fetch(`/api/rate-dragons?${params.toString()}`);
    const newDragons: BaseDragons = await response.json();

    setDragons((prevDragons) => [...prevDragons, ...newDragons]);
    setHasMore(newDragons.length === TAKE);
    setLoading(false);
  }, [loading, hasMore, dragons.length, rarity, filters]);

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (
          window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 500 &&
          !loading &&
          hasMore
        ) {
          loadMoreDragons();
        }
      }, 200); // Adjust the debounce delay as needed
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, hasMore, loadMoreDragons]);

  useEffect(() => {
    // When filters change, fetch new dragons
    const fetchFilteredDragons = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("skip", "0");
      params.append("take", TAKE.toString());
      params.append("rarity", rarity);

      // Append filters
      if (filters.search) params.append("search", filters.search);
      if (filters.element) params.append("element", filters.element);
      if (filters.familyName) params.append("familyName", filters.familyName);
      if (filters.skins) params.append("skins", filters.skins);

      const response = await fetch(`/api/rate-dragons?${params.toString()}`);
      const newDragons: BaseDragons = await response.json();

      setDragons(newDragons);
      setHasMore(newDragons.length === TAKE);
      setLoading(false);
    };

    fetchFilteredDragons();
  }, [filters, rarity]);

  // Handle filters
  const onFilterChange = (key: string, value: any) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    // Reset dragons and fetch from the beginning when filters change
    setDragons([]);
    setHasMore(true);
  };

  return (
    <div className="flex flex-col w-100 h-100 overflow-auto m-6 gap-6">
      <div className="flex flex-wrap justify-between items-center">
        <DragonFilters
          dragons={dragons}
          onFilterChange={onFilterChange}
          filters={filters}
          allowedFilters={["search", "element", "familyName", "skins"]}
        />
      </div>
      <RateDragonsTable dragons={dragons} />
      {loading && (
        <Center>
          <Loader />
        </Center>
      )}
    </div>
  );
}
