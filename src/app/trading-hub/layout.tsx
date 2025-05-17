import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";
import { TradingHubWrapper } from "@/components/TradingHubWrapper";

export const metadata: Metadata = {
  title: "Trading Hub | Dragon City Helper",
  description: "Connect with other players to trade dragons in Dragon City",
};

export default async function TradingHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If user is logged in, check if they need to set up contact info
  if (session) {
    const hasContactDetails = Boolean(
      session.user?.Contacts?.discord ||
        session.user?.Contacts?.facebook ||
        session.user?.Contacts?.twitter ||
        session.user?.Contacts?.instagram ||
        session.user?.Contacts?.reddit
    );

    // Don't redirect; let the client-side wrapper handle showing the modal for missing contact details
    // if (!hasContactDetails) {
    //   redirect("/settings?setup=required");
    // }
  }

  // For non-logged in users, just render the children
  // The root page will handle showing the public trading hub
  return (
    <MantineProvider>
      <SessionProvider session={session}>
        <TradingHubWrapper>
          {children}
        </TradingHubWrapper>
      </SessionProvider>
    </MantineProvider>
  );
}
