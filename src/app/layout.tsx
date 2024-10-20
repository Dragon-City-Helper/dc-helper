import { ColorSchemeScript, Container } from "@mantine/core";
import Theme from "@/components/Theme";
import BasicAppShell from "@/components/BasicAppShell";
import "@mantine/core/styles.css";
import "../styles/globals.css";

export default function RootLayout({
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
          <BasicAppShell>
            <Container my="md">{children}</Container>
          </BasicAppShell>
        </Theme>
      </body>
    </html>
  );
}
