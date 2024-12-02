"use client";

import { AppShell, Burger, Group, Menu, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import Logo from "./Logo";
import { FC, PropsWithChildren } from "react";
import { signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  IconBrandDiscordFilled,
  IconLogin2,
  IconLogout2,
  IconTipJar,
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
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: true, mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" w="100%" px="md" wrap="nowrap">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Group h="100%" w="100%" justify="space-between">
            <Logo />
            <Group ml="xl" gap={0} visibleFrom="sm" wrap="nowrap">
              <Menu
                shadow="md"
                trigger="click-hover"
                openDelay={100}
                closeDelay={400}
              >
                <Menu.Target>
                  <NavLink
                    label="Dragons"
                    active={["/", "/tierlist", "/dashboard"].includes(pathname)}
                  />
                </Menu.Target>
                <Menu.Dropdown>
                  <NavLink
                    onClick={close}
                    component={Link}
                    label="Home"
                    href="/"
                    active={pathname === "/"}
                    prefetch
                  />
                  <NavLink
                    w="100%"
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
                </Menu.Dropdown>
              </Menu>
              <Menu
                shadow="md"
                trigger="click-hover"
                openDelay={100}
                closeDelay={400}
              >
                <Menu.Target>
                  <NavLink
                    label="Alliances"
                    active={["/alliance-hub", "/alliances/manage"].includes(
                      pathname
                    )}
                  />
                </Menu.Target>
                <Menu.Dropdown>
                  <NavLink
                    onClick={close}
                    component={Link}
                    label="Alliance Hub"
                    href="/alliance-hub"
                    active={pathname === "/alliance-hub"}
                    prefetch
                  />
                  {session && (
                    <NavLink
                      onClick={close}
                      component={Link}
                      label="Manage Your Alliances"
                      href="/alliances/manage"
                      active={pathname === "/alliances/manage"}
                      // prefetch
                    />
                  )}
                </Menu.Dropdown>
              </Menu>
              {/* <Menu
                shadow="md"
                trigger="click-hover"
                openDelay={100}
                closeDelay={400}
              >
                <Menu.Target>
                  <NavLink label="Arenas" />
                </Menu.Target>
                <Menu.Dropdown></Menu.Dropdown>
              </Menu> */}
              <Menu shadow="md" trigger="hover" openDelay={100}>
                <Menu.Target>
                  <NavLink label="Community" />
                </Menu.Target>
                <Menu.Dropdown>
                  <NavLink
                    label="Discord"
                    leftSection={<IconBrandDiscordFilled color="#5865F2" />}
                    href="https://discord.gg/U8CyQYpnWT"
                    target="_blank"
                  />
                </Menu.Dropdown>
              </Menu>
              <NavLink
                href="https://buymeacoffee.com/8obtn6i2fc"
                label="Donate"
              />
              {session ? (
                <NavLink label="Logout" onClick={() => signOut()} />
              ) : (
                <NavLink label="Login" onClick={() => signIn()} />
              )}
            </Group>
          </Group>
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
          <NavLink
            onClick={close}
            component={Link}
            label="Alliance Hub"
            href="/alliance-hub"
            active={pathname === "/alliance-hub"}
            prefetch
          />
          {session && (
            <NavLink
              onClick={close}
              component={Link}
              label="Manage Your Alliances"
              href="/alliances/manage"
              active={pathname === "/alliances/manage"}
              // prefetch
            />
          )}
        </AppShell.Section>
        <AppShell.Section>
          <NavLink
            href="https://buymeacoffee.com/8obtn6i2fc"
            leftSection={<IconTipJar color="#FFD700" />}
            target="_blank"
            label="Donate"
          />
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
          <Link href="https://buymeacoffee.com/8obtn6i2fc" target="_blank">
            Donate
          </Link>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
};

export default BasicAppShell;
