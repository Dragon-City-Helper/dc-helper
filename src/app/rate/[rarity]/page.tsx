// app/rate/[rarity]/page.tsx
import { RateScreenDragons, fetchRateScreenDragons } from "@/services/dragons";
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

  // Retrieve the session on the server side
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  if (!session.user || session.user.role === Role.USER) {
    redirect("/no-access");
  }

  // Fetch the initial batch of dragons
  let dragons: RateScreenDragons = [];
  try {
    dragons = await fetchRateScreenDragons({ rarity, take: 30 }); // Fetch initial 50 dragons
  } catch (error) {
    console.error(error);
    notFound();
  }
  // Render the client component and pass the dragons data
  return <RateDragonsView initialDragons={dragons} rarity={rarity} />;
}
