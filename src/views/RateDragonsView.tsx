"use client";

import { RateDragons } from "@/services/dragons";
import RateDragonsTable from "@/components/RateDragonsTable";
import DragonFilters from "@/components/DragonFilters";
import useDragonFilters from "@/hooks/useDragonFilters";

export default function RateDragonsView({ dragons }: { dragons: RateDragons }) {
  const { filteredDragons, onFilterChange, filters } =
    useDragonFilters(dragons);

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
      <RateDragonsTable dragons={filteredDragons as RateDragons} />
    </div>
  );
}
