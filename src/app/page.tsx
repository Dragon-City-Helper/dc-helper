import { FC } from "react";
import Home from "@/views/Home";
import { fetchHomeDragons } from "@/services/dragons";
import { fetchOwned } from "@/services/owned";

export const revalidate = 43200; // revalidate every 12 hours

const Page: FC = async () => {
  const [dragons, ownedDragons] = await Promise.all([
    fetchHomeDragons(),
    fetchOwned(),
  ]);

  return <Home initialDragons={dragons.slice(0, 48)} owned={ownedDragons} />;
};

export default Page;
