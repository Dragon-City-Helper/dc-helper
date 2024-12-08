import { ColorSchemeScript, Container } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import Theme from "@/components/Theme";
import BasicAppShell from "@/components/BasicAppShell";
import "@mantine/core/styles.css";
import "../styles/globals.css";
import { auth } from "@/auth";
import { GoogleAnalytics } from "@next/third-parties/google";

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
