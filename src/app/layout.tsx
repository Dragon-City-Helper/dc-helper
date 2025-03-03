import { ColorSchemeScript, Container } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import Theme from "@/components/Theme";
import BasicAppShell from "@/components/BasicAppShell";
import { auth } from "@/auth";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "../styles/globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <Theme>
          <Notifications autoClose={3000} />
          <SessionProvider>
            <BasicAppShell session={session}>
              <Container my="md">{children}</Container>
            </BasicAppShell>
          </SessionProvider>
        </Theme>
      </body>
      <GoogleAnalytics gaId="G-QHLYJ2EH3M" />
    </html>
  );
}
