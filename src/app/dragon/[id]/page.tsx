// app/[id]/page.tsx

import { notFound } from "next/navigation";
import DragonDetails from "@/components/DragonDetails";
import {
  fetchAllDragonIds,
  fetchDragon,
  fetchSkinsForADragon,
} from "@/services/dragons";

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

  try {
    const dragonData = await fetchDragon(dragonId);

    if (!dragonData) {
      notFound();
    }

    const skinsData = await fetchSkinsForADragon(dragonData.name);

    return (
      <div className="flex gap-6 container flex-col">
        <DragonDetails dragon={dragonData} />
        {skinsData.length > 0 && (
          <div>
            <div className="flex justify-between items-center border border-gray-200 p-2 rounded-box">
              Skins
            </div>
            {skinsData.map((skin) => (
              <DragonDetails key={skin.id} dragon={skin} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (err) {
    console.error(err);
    notFound();
  }
}
