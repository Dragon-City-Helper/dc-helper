import { FC } from "react";
import Home from "@/views/Home";
import { fetchHomeDragons } from "@/services/dragons";
import { fetchOwned } from "@/services/owned";

export const revalidate = 43200; // revalidate every 12 hours

export const metadata = {
  title: "All Dragons in Dragon City | Dragon City Helper",
  description:
    "Discover the complete collection of dragons in Dragon City! Use Dragon City Helper to filter dragons by element, rarity, family, and more. Mark your dragons as owned or unowned and access detailed stats, skins, and abilities for every dragon.",
  keywords: [
    "Dragon City Helper",
    "All Dragons",
    "Dragon Collection",
    "Dragon Stats",
    "Dragon Skins",
    "Dragon Skills",
    "Dragon Elements",
    "Dragon Families",
    "Owned Dragons",
    "Unowned Dragons",
    "Dragon Rarity",
    "Best Dragons",
    "Dragon Filters",
  ].join(", "),
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const Page: FC = async () => {
  const [dragons, ownedDragons] = await Promise.all([
    fetchHomeDragons(),
    fetchOwned(),
  ]);

  return <Home initialDragons={dragons.slice(0, 48)} owned={ownedDragons} />;
};

export default Page;
