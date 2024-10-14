import {
  HomeDragons,
  fetchDragonsWithRatingsNotNull,
} from "@/services/dragons";
import DragonFilters from "@/components/DragonFilters";
import useDragonFilters from "@/hooks/useDragonFilters";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Role } from "@prisma/client";
import RatingStats from "@/components/RatingStats";

export async function getServerSideProps() {
  try {
    const dragons = await fetchDragonsWithRatingsNotNull();
    const sortedDragons = dragons.sort(
      (a, b) => (b.rating?.score || 0) - (a.rating?.score || 0),
    );
    return {
      props: {
        dragons: sortedDragons,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

export default function Page({ dragons }: { dragons: HomeDragons }) {
  const { filteredDragons, onFilterChange, filters } =
    useDragonFilters(dragons);
  const { status, data } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      if (!data?.user?.role || data?.user?.role === Role.USER) {
        router.push("/no-access");
      }
    } else if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [data?.user.id, data?.user.role, router, status]);
  return (
    <div className="flex flex-col w-100 h-100 overflow-auto m-6 gap-6">
      <DragonFilters
        dragons={dragons}
        onFilterChange={onFilterChange}
        filters={filters}
        allowedFilters={["search", "element", "familyName", "rarity", "skins"]}
      />
      <b>
        {filteredDragons.length === dragons.length
          ? `Showing all Dragons and Skins with rating`
          : `Showing ${filteredDragons.filter((d) => !d.isSkin).length} of ${
              dragons.filter((d) => !d.isSkin).length
            } dragons and ${
              filteredDragons.filter((d) => d.isSkin).length
            } of ${dragons.filter((d) => d.isSkin).length} Skins with rating`}
      </b>
      <RatingStats dragons={filteredDragons as HomeDragons} />
    </div>
  );
}
