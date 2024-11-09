// app/rate/[rarity]/page.tsx
import { BaseDragons, fetchRateScreenDragons } from "@/services/dragons";
import { Rarity, Role } from "@prisma/client";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import RateDragonsView from "@/views/RateDragonsView";
import { RarityNames } from "@/constants/Dragon";

export async function generateMetadata({
  params,
}: {
  params: { rarity: string };
}) {
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
  const rarityDisplayName = RarityNames[rarity] || "Rarity";
  return {
    title: `Rate ${rarityDisplayName} Dragons - Admin | Dragon City Helper`,
    description: `Internal page for rating dragons of ${rarityDisplayName} rarity. Access restricted to authorized users.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

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
  let dragons: BaseDragons = [];
  try {
    dragons = await fetchRateScreenDragons({ rarity, take: 30 }); // Fetch initial 50 dragons
  } catch (error) {
    console.error(error);
    notFound();
  }
  // Render the client component and pass the dragons data
  return <RateDragonsView initialDragons={dragons} rarity={rarity} />;
}
