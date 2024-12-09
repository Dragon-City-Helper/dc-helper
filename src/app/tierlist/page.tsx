import { fetchRatedDragons } from "@/services/dragons";
import { fetchOwned } from "@/services/owned";
import TierList from "@/views/Tierlist";
import { FC } from "react";

export const revalidate = 21600; // temporarily make it a dynamic page , later update the page to revalidate every 6 hour.

export const metadata = {
  title: "Dragon Tier List - Rankings & Filters | Dragon City Helper",
  description:
    "Explore the definitive Dragon Tier List on Dragon City Helper! Evaluate dragons ranked by overall performance, cooldown, value, versatility, potency, primary stats, and more. Tailor your search with filters for element, rarity, family name, VIP status, skins, and more to find the best dragon for your strategy.",
  keywords: [
    "Dragon City",
    "Dragon City Helper",
    "Dragon City Tier List",
    "Best Dragons",
    "Dragon Rankings",
    "Dragon Stats",
    "Dragon Elements",
    "Dragon Rarity",
    "Dragon Families",
    "Dragon Skins",
    "VIP Dragons",
    "Dragon Strategy",
    "Dragon Value",
    "Dragon City Arena",
    "Dragon City Meta",
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
    fetchRatedDragons(),
    fetchOwned(),
  ]);

  return <TierList dragons={dragons} owned={ownedDragons} />;
};

export default Page;
