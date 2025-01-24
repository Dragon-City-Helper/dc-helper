// dragon/[id]/page.tsx

import { notFound, redirect, RedirectType } from "next/navigation";
import DragonDetails from "@/components/DragonDetails";
import {
  fetchAllDragonIds,
  fetchDragon,
  fetchSkinsForADragon,
  fetchDragonByName,
} from "@/services/dragons";
import { Title } from "@mantine/core";
import { ElementsNames } from "@/constants/Dragon";

export const revalidate = 43200; // Revalidate every 12 hours

// Generate static params for dynamic routes
export async function generateStaticParams() {
  const dragonIds = await fetchAllDragonIds();
  return dragonIds.map((id) => ({
    id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;

  // Fetch dragon data
  const dragonData = await fetchDragon(id);

  if (!dragonData) {
    return {
      title: "Dragon Not Found - Dragon City Helper",
      description:
        "The requested dragon could not be found in Dragon City Helper.",
    };
  }
  const keywords = [
    dragonData.name,
    "Dragon City Helper",
    "Dragon Stats",
    "Dragon Skins",
    "Dragon City",
    "Dragon City Rankings",
    "Dragon City Ratings",
    dragonData.rarity,
    ...dragonData.elements.map((el) => ElementsNames[el]),
    `${dragonData.name} stats`,
    `${dragonData.name} skills`,
    `${dragonData.name} skins`,
    `${dragonData.name} rankings`,
    `${dragonData.name} ratings`,
  ].join(", ");
  // Define dynamic title and description based on dragon data
  return {
    title: `${dragonData.name} - Dragon Details | Dragon City Helper`,
    description: `Explore detailed information on ${dragonData.name}, including skills, stats, skins, and more in Dragon City Helper. Discover if ${dragonData.name} could be a valuable addition to your collection.`,
    keywords,
    openGraph: {
      title: `${dragonData.name} - Dragon City Helper`,
      description: `Discover detailed stats, skins, and abilities of ${dragonData.name} in Dragon City Helper.`,
      images: [
        {
          url: `https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui${dragonData.thumbnail}`,
          width: 1200,
          height: 630,
          alt: `${dragonData.name} in Dragon City`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${dragonData.name} - Dragon Details | Dragon City Helper`,
      description: `Check out ${dragonData.name}'s abilities, skins, and more on Dragon City Helper.`,
      images: [
        `https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui${dragonData.thumbnail}`,
      ],
    },
  };
}

// Page component
export default async function Page({ params }: { params: { id: string } }) {
  const dragonId = params.id;

  if (!dragonId) {
    notFound();
  }

  const dragonData = await fetchDragon(dragonId);

  if (!dragonData) {
    console.log("dragon data not found");
    notFound();
  }
  if (dragonData.isSkin) {
    if (dragonData.originalDragonName) {
      const originalDragon = await fetchDragonByName(
        dragonData.originalDragonName
      );
      redirect(`/dragon/${originalDragon.id}`, RedirectType.replace);
    } else {
      console.log("original dragon name not found");
      notFound();
    }
  }

  const skinsData = await fetchSkinsForADragon(dragonData.name);

  return (
    <div className="flex gap-6 container flex-col">
      <DragonDetails dragon={dragonData} />
      {skinsData.length > 0 && (
        <div>
          <Title order={2} my="lg">
            Skins
          </Title>
          {skinsData.map((skin) => (
            <DragonDetails key={skin.id} dragon={skin} />
          ))}
        </div>
      )}
    </div>
  );
}
