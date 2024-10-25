// app/rate/[rarity]/page.tsx
import { RateDragons, fetchRateDragons } from "@/services/dragons";
import { Rarity, Role } from "@prisma/client";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import RateDragonsView from "@/views/RateDragonsView";

export default async function Page({ params }: { params: { rarity: string } }) {
  const rarityParam = params.rarity;
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
    notFound();
  }

  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  if (!session.user || session.user.role === Role.USER) {
    redirect("/no-access");
  }

  // Fetch the dragons data
  let dragons: RateDragons = [];
  try {
    dragons = await fetchRateDragons({ rarity });
  } catch (error) {
    console.error(error);
    notFound();
  }

  // Render the client component and pass the dragons data
  return <RateDragonsView dragons={dragons} />;
}
