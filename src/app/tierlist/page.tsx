import { fetchRatedDragons, RateDragons } from "@/services/dragons";
import { FC } from "react";
import TierList from "./tierlist";

export const revalidate = 21600; // temporarily make it a dynamic page , later update the page to revalidate every 6 hour.

const Page: FC = async () => {
  const dragons: RateDragons = await fetchRatedDragons();

  return <TierList dragons={dragons} />;
};

export default Page;
