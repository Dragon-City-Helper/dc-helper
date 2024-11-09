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
        <ColorSchemeScript defaultColorScheme="dark" />
        {/*  eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          data-name="BMC-Widget"
          data-cfasync="false"
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-id="8oBtn6i2fC"
          data-description="Support me on Buy me a coffee!"
          data-message="Fuel the Dragons! Support Our Servers"
          data-color="#5F7FFF"
          data-position="Right"
          data-x_margin="18"
          data-y_margin="18"
        />
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
