"use client";

import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import Logo from "./Logo";
import { FC, PropsWithChildren } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  IconBrandDiscordFilled,
  IconLogin2,
  IconLogout2,
} from "@tabler/icons-react";
import { Session } from "next-auth";

interface IBasicAppShellProps {
  session: Session | null;
}
const BasicAppShell: FC<PropsWithChildren<IBasicAppShellProps>> = ({
  children,
  session,
}) => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const pathname = usePathname();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 200,
        breakpoint: "md",
        collapsed: { desktop: false, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} />
          <Logo />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppShell.Section grow my="md">
          <NavLink
            onClick={close}
            component={Link}
            label="Home"
            href="/"
            active={pathname === "/"}
            prefetch
          />
          <NavLink
            onClick={close}
            component={Link}
            label="Tierlist"
            href="/tierlist"
            active={pathname === "/tierlist"}
            prefetch
          />
          {session && (
            <NavLink
              onClick={close}
              component={Link}
              label="Dragon Dashboard"
              href="/dashboard"
              prefetch={false}
              active={pathname === "/dashboard"}
            />
          )}
        </AppShell.Section>
        <AppShell.Section>
          <NavLink
            label="Discord"
            leftSection={<IconBrandDiscordFilled color="#5865F2" />}
            href="https://discord.gg/U8CyQYpnWT"
            target="_blank"
          />
          {session ? (
            <NavLink
              label="Logout"
              leftSection={<IconLogout2 />}
              onClick={() => signOut()}
            />
          ) : (
            <NavLink
              label="Login"
              leftSection={<IconLogin2 />}
              onClick={() => signIn()}
            />
          )}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <AppShell.Footer>
        <Group fz="xs" justify="center">
          <Link href="/terms">Terms & Conditions</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
};

export default BasicAppShell;
