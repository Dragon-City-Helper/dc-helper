// app/api/dragons/route.ts

import { NextResponse } from "next/server";
import { fetchHomeDragons } from "@/services/dragons";
import { Elements, Rarity } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skip = Number(searchParams.get("skip")) || 0;
  const take = Number(searchParams.get("take")) || 50;
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

  // Fetch cached dragons
  let dragons = await fetchHomeDragons();

  // Apply filters
  dragons = dragons.filter((dragon) => {
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

  // Apply sorting
  const rarityOrder = ["H", "M", "L", "E", "V", "R", "C"];
  dragons.sort((a, b) => {
    // Sort by dragon.rating.overall (descending)
    if ((b.rating?.overall ?? 0) !== (a.rating?.overall ?? 0)) {
      return (b.rating?.overall ?? 0) - (a.rating?.overall ?? 0);
    }

    // Sort by dragon.rating.score (descending)
    if ((b.rating?.score ?? 0) !== (a.rating?.score ?? 0)) {
      return (b.rating?.score ?? 0) - (a.rating?.score ?? 0);
    }

    // Sort by dragon.isSkin (true values come first)
    if (a.isSkin !== b.isSkin) {
      return a.isSkin ? -1 : 1;
    }

    // Sort by dragon.rarity according to the specified order
    if (rarityOrder.indexOf(a.rarity) !== rarityOrder.indexOf(b.rarity)) {
      return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
    }

    // Sort by dragon.hasSkills (dragons with skills come first)
    if (a.hasSkills !== b.hasSkills) {
      return a.hasSkills ? -1 : 1;
    }

    return 0;
  });

  // Apply pagination
  const paginatedDragons = dragons.slice(skip, skip + take);

  return NextResponse.json(paginatedDragons);
}
