"use client";

import DragonFilters from "@/components/DragonFilters";
import Select from "@/components/Select";
import TierListLayout from "@/components/TierListLayout";
import {
  AllowedRatingKeys,
  RateByKeys,
  RatingKeysToText,
} from "@/constants/Rating";
import useDragonFilters from "@/hooks/useDragonFilters";
import { RateDragons } from "@/services/dragons";
import { useState } from "react";

export default function TierList({ dragons }: { dragons: RateDragons }) {
  const [ratingKey, setRatingKey] = useState<AllowedRatingKeys>("overall"); // default filter is overall
  const { filteredDragons, onFilterChange, filters } =
    useDragonFilters(dragons);
  const rateByOptions = RateByKeys.map((rKey) => ({
    value: rKey,
    label: RatingKeysToText[rKey],
  }));
  return (
    <div className="flex flex-col w-100 h-100 overflow-auto gap-6">
      <Select
        label="Rate By"
        width="sm"
        value={ratingKey}
        data={rateByOptions}
        allowDeselect={false}
        onChange={(value) => setRatingKey(value as AllowedRatingKeys)}
      />
      <DragonFilters
        dragons={dragons}
        onFilterChange={onFilterChange}
        filters={filters}
        allowedFilters={["search", "element", "familyName", "rarity", "skins"]}
      />
      <TierListLayout
        dragons={filteredDragons as RateDragons}
        ratingKey={ratingKey}
      />
    </div>
  );
}
