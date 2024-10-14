import { IFilters } from "@/components/DragonFilters";
import { HomeDragons, RateDragons } from "@/services/dragons";
import { Elements } from "@prisma/client";
import { useMemo, useState } from "react";

export default function useDragonFilters(
  dragons: HomeDragons | RateDragons,
  ownedIdsMap: Map<string, boolean> = new Map<string, boolean>(),
) {
  const [filters, setFilters] = useState<IFilters>({});
  const filteredDragons = useMemo(() => {
    let finalDragons: HomeDragons | RateDragons = dragons;
    if (filters.search) {
      finalDragons = finalDragons.filter((dragon) =>
        new RegExp(`${filters.search}`, "gi").test(dragon.name),
      ) as HomeDragons | RateDragons;
    }
    if (filters.rarity && filters.rarity !== "all") {
      finalDragons = finalDragons.filter(
        (dragon) => dragon.rarity === filters.rarity,
      ) as HomeDragons | RateDragons;
    }
    if (filters.familyName && filters.familyName !== "all") {
      finalDragons = finalDragons.filter(
        (dragon) => dragon.familyName === filters.familyName,
      ) as HomeDragons | RateDragons;
    }
    if (filters.element && filters.element !== "all") {
      finalDragons = finalDragons.filter((dragon) =>
        dragon.elements.includes(filters.element as Elements),
      ) as HomeDragons | RateDragons;
    }
    switch (filters.show) {
      case "owned":
        finalDragons = finalDragons.filter((dragon) =>
          ownedIdsMap.has(dragon.id),
        ) as HomeDragons | RateDragons;
        break;
      case "unowned":
        finalDragons = finalDragons.filter(
          (dragon) => !ownedIdsMap.has(dragon.id),
        ) as HomeDragons | RateDragons;
      case "all":
      default:
        break;
    }
    switch (filters.skins) {
      case "dragons":
        finalDragons = finalDragons.filter((dragon) => !dragon.isSkin) as
          | HomeDragons
          | RateDragons;
        break;
      case "skins":
        finalDragons = finalDragons.filter((dragon) => dragon.isSkin) as
          | HomeDragons
          | RateDragons;
      case "all":
      default:
        break;
    }
    switch (filters.show) {
      case "owned":
        finalDragons = finalDragons.filter((dragon) =>
          ownedIdsMap.has(dragon.id),
        ) as HomeDragons | RateDragons;
        break;
      case "unowned":
        finalDragons = finalDragons.filter(
          (dragon) => !ownedIdsMap.has(dragon.id),
        ) as HomeDragons | RateDragons;
      case "all":
      default:
        break;
    }
    return finalDragons;
  }, [
    dragons,
    filters.element,
    filters.familyName,
    filters.rarity,
    filters.search,
    filters.show,
    filters.skins,
    ownedIdsMap,
  ]);

  const onFilterChange = (key: keyof IFilters, e: any) => {
    setFilters({
      ...filters,
      [key]: e.target.value,
    });
  };

  return {
    filteredDragons,
    filters,
    onFilterChange,
  };
}
