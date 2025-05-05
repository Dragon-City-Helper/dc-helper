import { FC } from "react";
import TradingHub from "@/views/TradingHub";
import { getTrades } from "@/services/trades";
import { auth } from "@/auth";

export const metadata = {
  title: "Trading Hub | Dragon City Helper",
  description: "Trade dragons with other players on Dragon City Helper!",
  keywords: [
    "Dragon City",
    "Dragon City Helper",
    "Trading Hub",
    "Dragon Trading",
    "Dragon City Trading",
    "Dragon City Trading Hub",
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
  const trades = await getTrades();
  return <TradingHub trades={trades} />;
};

export default Page;
