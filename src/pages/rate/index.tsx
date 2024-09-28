import { dragonsWithRating, fetchDragonsWithRatings } from "@/services/dragons";
import { useEffect } from "react";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import RateDragonsTable from "@/components/RateDragonsTable";

export async function getServerSideProps() {
  try {
    const dragons = await fetchDragonsWithRatings({ rarity: "H" });
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
