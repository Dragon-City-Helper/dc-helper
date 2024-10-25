import { ColorSchemeScript, Container } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Theme from "@/components/Theme";
import BasicAppShell from "@/components/BasicAppShell";
import "@mantine/core/styles.css";
import "../styles/globals.css";
import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Theme>
          <SessionProvider>
            <BasicAppShell session={session}>
              <Container my="md">{children}</Container>
            </BasicAppShell>
          </SessionProvider>
        </Theme>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
