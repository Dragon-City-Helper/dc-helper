import { HomeDragons, RateDragons } from "@/services/dragons";
import { IFilters } from "@/types/filters";
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
    if (filters.rarity) {
      finalDragons = finalDragons.filter(
        (dragon) => dragon.rarity === filters.rarity,
      ) as HomeDragons | RateDragons;
    }
    if (filters.familyName) {
      finalDragons = finalDragons.filter(
        (dragon) => dragon.familyName === filters.familyName,
      ) as HomeDragons | RateDragons;
    }
    if (filters.element) {
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
        break;
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
        break;
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
        break;
      default:
        break;
    }
    switch (filters.vip) {
      case "vip":
        finalDragons = finalDragons.filter((dragon) => dragon.isVip) as
          | HomeDragons
          | RateDragons;
        break;
      case "normal":
        finalDragons = finalDragons.filter((dragon) => !dragon.isVip) as
          | HomeDragons
          | RateDragons;
        break;
      default:
        break;
    }
    switch (filters.skill) {
      case "any":
        finalDragons = finalDragons.filter((dragon) => dragon.hasSkills) as
          | HomeDragons
          | RateDragons;
        break;
      case "no":
        finalDragons = finalDragons.filter((dragon) => !dragon.hasSkills) as
          | HomeDragons
          | RateDragons;
        break;
      case "ps":
        finalDragons = finalDragons.filter(
          (dragon) => dragon.skillType === 0,
        ) as HomeDragons | RateDragons;
        break;
      case "as":
        finalDragons = finalDragons.filter(
          (dragon) => dragon.skillType === 1,
        ) as HomeDragons | RateDragons;
        break;
      case "aps":
        finalDragons = finalDragons.filter(
          (dragon) => dragon.skillType === 2,
        ) as HomeDragons | RateDragons;
        break;
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
    filters.skill,
    filters.skins,
    filters.vip,
    ownedIdsMap,
  ]);

  const onFilterChange = (key: keyof IFilters, value: any) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  return {
    filteredDragons,
    filters,
    onFilterChange,
  };
}
