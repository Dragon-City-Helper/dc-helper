import { FC } from "react";
import Home from "@/views/Home";
import { fetchHomeDragons } from "@/services/dragons";
import { fetchOwned } from "@/services/owned";

export const revalidate = 43200; // revalidate every 12 hours

export const metadata = {
  title: "Dragon City Helper - All Dragons",
  description:
    "Explore all dragons in Dragon City with Dragon City Helper! Filter dragons, mark them as owned or unowned, and get detailed information for each dragon.",
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
