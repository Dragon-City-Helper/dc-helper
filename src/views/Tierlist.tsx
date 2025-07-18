"use client";

import DragonFilters from "@/components/DragonFilters";
import Select from "@/components/Select";
import SkinImage from "@/components/SkinImage";
import TierListLayout from "@/components/TierListLayout";
import {
  AllowedRatingKeys,
  RateByKeys,
  RatingKeysToText,
  RatingKeyTooltips,
} from "@/constants/Rating";
import useDragonFilters from "@/hooks/useDragonFilters";
import { BaseDragons } from "@/services/dragons";
import { IFilters } from "@/types/filters";
import { Group, Text } from "@mantine/core";
import { useMemo, useState } from "react";

export default function TierList({
  dragons,
  owned,
}: {
  dragons: BaseDragons;
  owned: string[];
}) {
  const [ratingKey, setRatingKey] = useState<AllowedRatingKeys>("overall"); // default filter is overall

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
  const rateByOptions = RateByKeys.map((rKey) => ({
    value: rKey,
    label: RatingKeysToText[rKey],
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
        onChange={(value) => setRatingKey(value as AllowedRatingKeys)}
      />
      <Text>{RatingKeyTooltips[ratingKey]}</Text>
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
      <TierListLayout dragons={filteredDragons} ratingKey={ratingKey} />
    </div>
  );
}
