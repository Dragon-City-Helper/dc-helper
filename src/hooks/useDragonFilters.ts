import { BaseDragons } from "@/services/dragons";
import { IFilters } from "@/types/filters";
import { Elements } from "@prisma/client";
import { useMemo, useState } from "react";

export default function useDragonFilters(
  dragons: BaseDragons,
  ownedIdsMap: Map<string, boolean> = new Map<string, boolean>(),
) {
  const [filters, setFilters] = useState<IFilters>({});
  const filteredDragons = useMemo(() => {
    let finalDragons = dragons;
    if (filters.search) {
      finalDragons = finalDragons.filter((dragon) =>
        new RegExp(`${filters.search}`, "gi").test(dragon.name),
      );
    }
    if (filters.rarity) {
      finalDragons = finalDragons.filter(
        (dragon) => dragon.rarity === filters.rarity,
      );
    }
    if (filters.familyName) {
      finalDragons = finalDragons.filter(
        (dragon) => dragon.familyName === filters.familyName,
      );
    }
    if (filters.element) {
      finalDragons = finalDragons.filter((dragon) =>
        dragon.elements.includes(filters.element as Elements),
      );
    }
    switch (filters.show) {
      case "owned":
        finalDragons = finalDragons.filter((dragon) =>
          ownedIdsMap.has(dragon.id),
        );
        break;
      case "unowned":
        finalDragons = finalDragons.filter(
          (dragon) => !ownedIdsMap.has(dragon.id),
        );
        break;
      default:
        break;
    }
    switch (filters.skins) {
      case "dragons":
        finalDragons = finalDragons.filter((dragon) => !dragon.isSkin);
        break;
      case "skins":
        finalDragons = finalDragons.filter((dragon) => dragon.isSkin);
        break;
      default:
        break;
    }
    switch (filters.show) {
      case "owned":
        finalDragons = finalDragons.filter((dragon) =>
          ownedIdsMap.has(dragon.id),
        );
        break;
      case "unowned":
        finalDragons = finalDragons.filter(
          (dragon) => !ownedIdsMap.has(dragon.id),
        );
        break;
      default:
        break;
    }
    switch (filters.vip) {
      case "vip":
        finalDragons = finalDragons.filter((dragon) => dragon.isVip);

        break;
      case "normal":
        finalDragons = finalDragons.filter((dragon) => !dragon.isVip);
        break;
      default:
        break;
    }
    switch (filters.skill) {
      case "any":
        finalDragons = finalDragons.filter((dragon) => dragon.hasSkills);
        break;
      case "no":
        finalDragons = finalDragons.filter((dragon) => !dragon.hasSkills);
        break;
      case "ps":
        finalDragons = finalDragons.filter((dragon) => dragon.skillType === 0);
        break;
      case "as":
        finalDragons = finalDragons.filter((dragon) => dragon.skillType === 1);
        break;
      case "aps":
        finalDragons = finalDragons.filter((dragon) => dragon.skillType === 2);
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

  const isClientOnlyFilter = (key: keyof IFilters) => {
    return ["show"].includes(key);
  };

  return {
    filteredDragons,
    filters,
    onFilterChange,
    isClientOnlyFilter,
  };
}
