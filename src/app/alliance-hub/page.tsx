import { FC } from "react";
import AllianceHub from "@/views/AllianceHub";
import { fetchAlliances } from "@/services/alliances";
import { auth } from "@/auth";

export const metadata = {
  title: "Alliance Hub - Dragon City Helper",
  description:
    "Discover and join alliances in Dragon City. Use filters to find the perfect alliance for you.",
  keywords: [
    "Dragon City",
    "Alliances",
    "Alliance Hub",
    "Dragon City Helper",
    "Gaming",
  ],
  authors: [
    { name: "Dragon City Helper", url: "https:/www.dragoncityhelper.com" },
  ],
  creator: "Dragon City Helper",
  openGraph: {
    title: "Alliance Hub - Dragon City Helper",
    description:
      "Discover and join alliances in Dragon City Helper. Use filters to find the perfect alliance for you.",
    url: "https://www.dragoncityhelper.com/alliance-hub",
    siteName: "Dragon City Helper",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alliance Hub - Dragon City Helper",
    description:
      "Discover and join alliances in Dragon City Helper. Use filters to find the perfect alliance for you.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const Page: FC = async () => {
  const session = await auth();
  const { alliances } = await fetchAlliances({ page: 1, perPage: 20 });
  return <AllianceHub initialAlliances={alliances} session={session} />;
};

export default Page;
