import { dragonsWithRating, fetchDragonsWithRatings } from "@/services/dragons";
import { useEffect } from "react";
import { Rarity, Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import RateDragonsTable from "@/components/RateDragonsTable";
import { NextRequest } from "next/server";
import { GetServerSidePropsContext } from "next";

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
    const dragons = await fetchDragonsWithRatings({
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

export default function Page({ dragons }: { dragons: dragonsWithRating }) {
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
    <div className="flex flex-row w-100 h-100 overflow-auto">
      <div className="flex-1 m-6">
        <RateDragonsTable dragons={dragons} />
      </div>
    </div>
  );
}
