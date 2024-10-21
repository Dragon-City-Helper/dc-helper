import { ColorSchemeScript, Container } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import Theme from "@/components/Theme";
import BasicAppShell from "@/components/BasicAppShell";
import "@mantine/core/styles.css";
import "../styles/globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Theme>
          <SessionProvider>
            <BasicAppShell>
              <Container my="md">{children}</Container>
            </BasicAppShell>
          </SessionProvider>
        </Theme>
      </body>
    </html>
  );
}
