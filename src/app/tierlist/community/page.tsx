import { fetchUserRatedDragons } from "@/services/dragons";
import { fetchOwned } from "@/services/owned";
import CommunityTierList from "@/views/CommunityTierList";
import { FC } from "react";

export const revalidate = 21600; // temporarily make it a dynamic page , later update the page to revalidate every 6 hour.

export const metadata = {
  title: "Dragon City Community Ratings Tier List | Dragon City Helper",
  description:
    "Explore the Dragon Tier List with Community Ratings on Dragon City Helper! See dragons ranked by real player votes for arena performance and design. Find the best-looking and most powerful dragons based on community feedback.",
  keywords: [
    "Dragon City",
    "Dragon City Helper",
    "Dragon City Tier List",
    "Best Dragons",
    "Dragon Rankings",
    "Community Ratings",
    "Arena Ratings",
    "Design Ratings",
    "User Ratings",
    "Dragon City Community",
    "Dragon Stats",
    "Dragon Elements",
    "Dragon Rarity",
    "Dragon Families",
    "Dragon Skins",
    "VIP Dragons",
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
    fetchUserRatedDragons(),
    fetchOwned(),
  ]);

  return <CommunityTierList dragons={dragons} owned={ownedDragons} />;
};

export default Page;
