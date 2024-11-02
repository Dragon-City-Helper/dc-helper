import { fetchRatedDragons } from "@/services/dragons";
import { fetchOwned } from "@/services/owned";
import TierList from "@/views/Tierlist";
import { FC } from "react";

export const revalidate = 21600; // temporarily make it a dynamic page , later update the page to revalidate every 6 hour.

export const metadata = {
  title: "Dragon City Helper - Dragon Tier List",
  description:
    "Discover the ultimate Dragon Tier List on Dragon City Helper! Explore rankings for each dragon based on overall performance, cooldown, value, versatility, potency, primary stats, coverage, usability, and viability. Easily filter dragons by element, family name, rarity, skins, VIP status, and more.",
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
