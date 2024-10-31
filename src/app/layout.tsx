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
        {(process.env.NODE_ENV === "development" ||
          process.env.VERCEL_ENV === "preview") && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script
            data-recording-token="95jv6WnP4CBRRNX9nVOuPgx19FtBwHWzy8xsNQYi"
            data-is-production-environment="false"
            src="https://snippet.meticulous.ai/v1/meticulous.js"
          />
        )}
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
