// app/dashboard/page.tsx

import { auth } from "@/auth";
import { fetchHomeDragons, BaseDragons } from "@/services/dragons";
import { fetchOwned } from "@/services/owned";
import DragonDashboard from "@/views/DragonDashboard";
import { Elements } from "@prisma/client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const DashboardPage = async () => {
  // Retrieve the session on the server side
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  // Fetch data from your APIs
  const ownedDragonIds: string[] = await fetchOwned();
  const allDragons: BaseDragons = await fetchHomeDragons();

  // Filter the dragons to get only the ones you own
  const ownedDragons = allDragons.filter((dragon) =>
    ownedDragonIds.includes(dragon.id)
  );

  // Compute statistics
  const totalOwnedDragons = ownedDragons.filter((d) => !d.isSkin).length;

  // Counts by various attributes, segregating skins and dragons
  const rarityCounts = ownedDragons.reduce((acc, dragon) => {
    if (!acc[dragon.rarity]) {
      acc[dragon.rarity] = { dragons: 0, skins: 0 };
    }
    if (dragon.hasAllSkins) {
      return acc;
    }
    if (dragon.isSkin) {
      acc[dragon.rarity].skins += 1;
    } else {
      acc[dragon.rarity].dragons += 1;
    }
    return acc;
  }, {} as Record<string, { dragons: number; skins: number }>);

  const elementCounts = ownedDragons.reduce((acc, dragon) => {
    dragon.elements.forEach((element) => {
      if (!acc[element]) {
        acc[element] = { dragons: 0, skins: 0 };
      }
      if (dragon.hasAllSkins) {
        return acc;
      }
      if (dragon.isSkin) {
        acc[element].skins += 1;
      } else {
        acc[element].dragons += 1;
      }
    });
    return acc;
  }, {} as Record<string, { dragons: number; skins: number }>);

  const vipCounts = {
    dragons: ownedDragons.filter((dragon) => dragon.isVip && !dragon.isSkin)
      .length,
    skins: ownedDragons.filter(
      (dragon) => dragon.isVip && dragon.isSkin && !dragon.hasAllSkins
    ).length,
  };

  const skinCount = ownedDragons.filter(
    (dragon) => dragon.isSkin && !dragon.hasAllSkins
  ).length;

  const familyCounts = ownedDragons.reduce((acc, dragon) => {
    if (dragon.familyName) {
      if (!acc[dragon.familyName]) {
        acc[dragon.familyName] = { dragons: 0, skins: 0 };
      }
      if (dragon.hasAllSkins) {
        return acc;
      }
      if (dragon.isSkin) {
        acc[dragon.familyName].skins += 1;
      } else {
        acc[dragon.familyName].dragons += 1;
      }
    }
    return acc;
  }, {} as Record<string, { dragons: number; skins: number }>);

  const tagCounts = ownedDragons.reduce((acc, dragon) => {
    dragon.tags.forEach((tag) => {
      if (!acc[tag]) {
        acc[tag] = { dragons: 0, skins: 0 };
      }
      if (dragon.hasAllSkins) {
        return acc;
      }
      if (dragon.isSkin) {
        acc[tag].skins += 1;
      } else {
        acc[tag].dragons += 1;
      }
    });
    return acc;
  }, {} as Record<string, { dragons: number; skins: number }>);
  const rarityOrder = ["H", "M", "L", "E", "V", "R", "C"];

  const topRatedDragonsByElement = Object.values(
    ownedDragons
      .filter(
        (dragon) => dragon.rating && typeof dragon.rating.overall === "number"
      )
      .reduce<{ [key: string]: BaseDragons[number] }>((acc, dragon) => {
        const key = dragon.originalDragonName || dragon.name;
        if (!acc[key] || acc[key]?.rating!.overall < dragon?.rating!.overall) {
          acc[key] = dragon; // Keep only the highest-rated variant
        }
        return acc;
      }, {})
  )
    .sort((a, b) => {
      if (b.rating?.overall !== a.rating?.overall)
        return (b.rating?.overall ?? 0) - (a.rating?.overall ?? 0);
      if (b.rating?.score !== a.rating?.score)
        return (b.rating?.score ?? 0) - (a.rating?.score ?? 0);
      if (a.isSkin !== b.isSkin) return a.isSkin ? -1 : 1;
      return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
    })
    .reduce<Record<Elements, BaseDragons>>((acc, curr) => {
      const elements = curr.elements;
      const newAcc = elements.reduce((acc1, curr1) => {
        if (acc?.[curr1]?.length >= 6) {
          return acc1;
        }
        return {
          ...acc1,
          [curr1]: [...(acc?.[curr1] ?? []), curr],
        };
      }, {});
      return {
        ...acc,
        ...newAcc,
      };
    }, {} as Record<Elements, BaseDragons>);
  // Prepare stats to pass to the client component
  const stats = {
    totalOwnedDragons,
    rarityCounts,
    elementCounts,
    vipCounts,
    skinCount,
    familyCounts,
    tagCounts,
    topRatedDragonsByElement,
  };

  // Render the client component with the stats
  return <DragonDashboard stats={stats} />;
};

export default DashboardPage;
