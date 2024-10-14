import { RateDragons, fetchRateDragons } from "@/services/dragons";
import { useEffect } from "react";
import { Rarity, Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import RateDragonsTable from "@/components/RateDragonsTable";
import { GetServerSidePropsContext } from "next";
import DragonFilters from "@/components/DragonFilters";
import useDragonFilters from "@/hooks/useDragonFilters";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const rarityParam = context.params?.rarity as string;
  const rarityMapping: { [key: string]: Rarity } = {
    heroic: Rarity.H,
    mythical: Rarity.M,
    legendary: Rarity.L,
    epic: Rarity.E,
    "very-rare": Rarity.V,
    rare: Rarity.R,
    common: Rarity.C,
  };
  const rarity = rarityMapping[rarityParam];
  if (!rarity) {
    return {
      notFound: true,
    };
  }
  try {
    const dragons = await fetchRateDragons({
      rarity,
    });
    return {
      props: {
        dragons,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

export default function Page({ dragons }: { dragons: RateDragons }) {
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
