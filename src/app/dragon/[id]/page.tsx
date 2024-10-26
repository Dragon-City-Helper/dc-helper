// app/[id]/page.tsx

import { notFound, redirect, RedirectType } from "next/navigation";
import DragonDetails from "@/components/DragonDetails";
import {
  fetchAllDragonIds,
  fetchDragon,
  fetchSkinsForADragon,
  fetchDragonByName,
} from "@/services/dragons";
import { Title } from "@mantine/core";

export const revalidate = 43200; // Revalidate every 12 hours

// Generate static params for dynamic routes
export async function generateStaticParams() {
  const dragonIds = await fetchAllDragonIds();
  return dragonIds.map((id) => ({
    id,
  }));
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
        dragonData.originalDragonName,
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
