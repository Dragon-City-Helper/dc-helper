"use client";

import DragonFilters from "@/components/DragonFilters";
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
  return (
    <div className="flex flex-col w-100 h-100 overflow-auto m-6 gap-6">
      <DragonFilters
        dragons={dragons}
        onFilterChange={onFilterChange}
        filters={filters}
        allowedFilters={["search", "element", "familyName", "rarity", "skins"]}
      />
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Rate By</span>
        </div>
        <select
          value={ratingKey}
          className="select select-bordered"
          onChange={(e) => setRatingKey(e.target.value as AllowedRatingKeys)}
        >
          {RateByKeys.map((rKey) => {
            return (
              <option key={rKey} value={rKey}>
                {RatingKeysToText[rKey]}
              </option>
            );
          })}
        </select>
      </label>
      <TierListLayout
        dragons={filteredDragons as RateDragons}
        ratingKey={ratingKey}
      />
    </div>
  );
}
