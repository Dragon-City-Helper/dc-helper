import { fetchRatedDragons, RateDragons } from "@/services/dragons";
import { FC } from "react";
import TierList from "./tierlist";

export const revalidate = 0; // temporarily make it a dynamic page , later update the page to revalidate every 1 hour.

const Page: FC = async () => {
  const dragons: RateDragons = await fetchRatedDragons();

  return <TierList dragons={dragons} />;
};

export default Page;
