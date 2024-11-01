import { fetchRatedDragons } from "@/services/dragons";
import { fetchOwned } from "@/services/owned";
import TierList from "@/views/Tierlist";
import { FC } from "react";

export const revalidate = 21600; // temporarily make it a dynamic page , later update the page to revalidate every 6 hour.

const Page: FC = async () => {
  const [dragons, ownedDragons] = await Promise.all([
    fetchRatedDragons(),
    fetchOwned(),
  ]);

  return <TierList dragons={dragons} owned={ownedDragons} />;
};

export default Page;
