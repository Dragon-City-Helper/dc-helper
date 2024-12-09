import { FC } from "react";
import { fetchUserOwnedAlliances } from "@/services/alliances";
import { auth } from "@/auth";
import ManageAlliances from "@/views/ManageAlliances";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Manage Your Alliances | Dragon City Helper",
  description:
    "Effortlessly manage your Dragon City alliances with Dragon City Helper. View, edit, and organize your alliances in one convenient dashboard. Track alliance stats, members, and performance with ease.",
  keywords: [
    "Dragon City Helper",
    "Manage Alliances",
    "Dragon Alliances",
    "Alliance Management",
    "Dragon City Dashboard",
    "Alliance Stats",
    "Alliance Members",
    "Alliance Performance",
    "Organize Alliances",
    "Alliance Tools",
  ].join(", "),
  robots: {
    index: false, // Set to false if this page is private and should not be indexed
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};
const Page: FC = async () => {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }
  const alliances = await fetchUserOwnedAlliances(session.user.id);
  return <ManageAlliances alliances={alliances} session={session} />;
};

export default Page;
