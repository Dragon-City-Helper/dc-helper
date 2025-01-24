// app/api/dragons/route.ts

import { NextResponse } from "next/server";
import { fetchHomeDragons } from "@/services/dragons";
import { Elements, Rarity } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skip = Number(searchParams.get("skip")) || 0;
  const take = Number(searchParams.get("take")) || 24;
  const rarity = (searchParams.get("rarity") as Rarity) ?? undefined;
  const element = (searchParams.get("element") as Elements) ?? undefined;
  const familyName = searchParams.get("familyName") || undefined;
  const isSkinParam = searchParams.get("isSkin");
  const isSkin =
    isSkinParam === "true" ? true : isSkinParam === "false" ? false : undefined;
  const isVipParam = searchParams.get("isVip");
  const isVip =
    isVipParam === "true" ? true : isVipParam === "false" ? false : undefined;
  const skillTypeParam = searchParams.get("skillType");
  const skillType =
    skillTypeParam !== null ? Number(skillTypeParam) : undefined;
  const search = searchParams.get("search") || undefined;

  console.log(
    "GET request received at /api/dragons with the following filters:",
    {
      skip,
      take,
      rarity,
      element,
      familyName,
      isSkin,
      isVip,
      skillType,
      search,
    }
  );

  try {
    // Fetch cached dragons
    let dragons = await fetchHomeDragons();
    console.log(`Fetched ${dragons.length} dragons from cache`);

    // Apply filters
    const filteredDragons = dragons.filter((dragon) => {
      let isMatch = true;

      if (rarity && dragon.rarity !== rarity) {
        isMatch = false;
      }
      if (element && !dragon.elements.includes(element)) {
        isMatch = false;
      }
      if (familyName && dragon.familyName !== familyName) {
        isMatch = false;
      }
      if (isSkin !== undefined && dragon.isSkin !== isSkin) {
        isMatch = false;
      }
      if (isVip !== undefined && dragon.isVip !== isVip) {
        isMatch = false;
      }
      if (skillType !== undefined && dragon.skillType !== skillType) {
        isMatch = false;
      }
      if (search && !dragon.name.toLowerCase().includes(search.toLowerCase())) {
        isMatch = false;
      }

      return isMatch;
    });

    console.log(
      `Filtered down to ${filteredDragons.length} dragons based on filters`
    );

    // Prepare response
    const response = {
      dragons: filteredDragons.slice(skip, skip + take),
      filterDragonsCount: filteredDragons.filter((d) => !d.isSkin).length,
      filterSkinsCount: filteredDragons.filter((d) => d.isSkin).length,
      totalDragonsCount: dragons.filter((d) => !d.isSkin).length,
      totalSkinsCount: dragons.filter((d) => d.isSkin).length,
      showMore: filteredDragons.length > skip + take,
    };

    console.log("Response prepared with pagination details:", {
      returnedDragonsCount: response.dragons.length,
      filterDragonsCount: response.filterDragonsCount,
      filterSkinsCount: response.filterSkinsCount,
      totalDragonsCount: response.totalDragonsCount,
      totalSkinsCount: response.totalSkinsCount,
      showMore: response.showMore,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching or filtering dragons:", error);
    return NextResponse.json(
      { error: "Failed to fetch dragons" },
      { status: 500 }
    );
  }
}
