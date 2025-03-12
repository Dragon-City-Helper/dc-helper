"use client";

import CommunityTierListLayout from "@/components/CommunityTierListLayout";
import DragonFilters from "@/components/DragonFilters";
import Select from "@/components/Select";
import SkinImage from "@/components/SkinImage";
import {
  CommunityRatingKeyTooltips,
  CommunityRatingKeysToText,
} from "@/constants/Rating";
import useDragonFilters from "@/hooks/useDragonFilters";
import { BaseDragons } from "@/services/dragons";
import { IFilters } from "@/types/filters";
import { Group, Text } from "@mantine/core";
import { useMemo, useState } from "react";

export default function CommunityTierList({
  dragons,
  owned,
}: {
  dragons: BaseDragons;
  owned: string[];
}) {
  const [ratingKey, setRatingKey] = useState<"arena" | "design">("arena");

  const ownedIdsMap = useMemo(() => {
    return owned.reduce((acc, curr) => {
      acc.set(curr, true);
      return acc;
    }, new Map<string, boolean>());
  }, [owned]);

  const { filteredDragons, onFilterChange, filters } = useDragonFilters(
    dragons,
    ownedIdsMap
  );
  const rateByOptions = ["arena", "design"].map((rKey) => ({
    value: rKey,
    label: CommunityRatingKeysToText[rKey as "arena" | "design"],
  }));

  const allowedFilters: (keyof IFilters)[] = [
    "search",
    "element",
    "familyName",
    "rarity",
    "skins",
    "vip",
  ];

  if (owned.length > 0) {
    allowedFilters.push("show");
  }

  return (
    <div className="flex flex-col w-100 h-100 overflow-auto gap-6">
      <DragonFilters
        dragons={dragons}
        onFilterChange={onFilterChange}
        filters={filters}
        allowedFilters={allowedFilters}
      />
      <Select
        label="Rate By"
        width="sm"
        value={ratingKey}
        data={rateByOptions}
        allowDeselect={false}
        onChange={(value) => setRatingKey(value as "arena" | "design")}
      />
      <Text>{CommunityRatingKeyTooltips[ratingKey as "arena" | "design"]}</Text>
      {filters.skins !== "dragons" && (
        <Group justify="start">
          <Group py="sm">
            <SkinImage hasAllSkins /> - All Skins
          </Group>
          <Group py="sm">
            <SkinImage hasAllSkins={false} /> - Skin
          </Group>
        </Group>
      )}
      <CommunityTierListLayout
        dragons={filteredDragons}
        ratingKey={ratingKey}
      />
    </div>
  );
}
