"use client";

import {
  AppShell,
  Avatar,
  Badge,
  Burger,
  Group,
  Menu,
  NavLink,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import Logo from "./Logo";
import { FC, PropsWithChildren, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  IconBrandDiscordFilled,
  IconLogin2,
  IconLogout2,
  IconTipJar,
  IconUser,
  IconUserEdit,
} from "@tabler/icons-react";
import { Session } from "next-auth";
import { sendGAEvent } from "@next/third-parties/google";
import UpdateContactModal from "./UpdateContactModal";

interface IBasicAppShellProps {
  session: Session | null;
}
const BasicAppShell: FC<PropsWithChildren<IBasicAppShellProps>> = ({
  children,
  session,
}) => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [contactModalOpened, setContactModalOpened] = useState(false);
  const pathname = usePathname();
  const { data: sessionData } = useSession();

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
                  <NavLink label="Dragons" />
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
                  <NavLink
                    w="100%"
                    onClick={close}
                    component={Link}
                    label="Community Tierlist"
                    href="/tierlist/community"
                    active={pathname === "/tierlist/community"}
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
              {/* <Menu
                shadow="md"
                trigger="click-hover"
                openDelay={100}
              >
                <Menu.Target>
                  <NavLink label="Arenas" />
                </Menu.Target>
                <Menu.Dropdown></Menu.Dropdown>
              </Menu> */}
              {session && (
                <NavLink
                  component={Link}
                  label={
                    <Group gap="xs" wrap="nowrap">
                      <span>Trading</span>
                    </Group>
                  }
                  href="/trading-hub/me"
                  active={pathname.startsWith("/trading-hub")}
                  prefetch={false}
                  onClick={() => {
                    sendGAEvent("event", "trading-hub-click", {});
                  }}
                />
              )}
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
                    onClick={() => {
                      sendGAEvent("event", "discord-click", {});
                    }}
                  />
                </Menu.Dropdown>
              </Menu>
              <NavLink
                href="https://buymeacoffee.com/8obtn6i2fc"
                label="Donate"
                target="_blank"
                onClick={() => {
                  sendGAEvent("event", "donate-click", {});
                }}
              />
              {session ? (
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <NavLink
                      label={
                        <Group gap="xs" wrap="nowrap" align="center">
                          <Avatar
                            size="sm"
                            radius="xl"
                            src={session.user?.image}
                            alt={session.user?.name || "User"}
                          >
                            {session.user?.name?.[0] || <IconUser size={16} />}
                          </Avatar>
                          <Text size="sm" truncate style={{ lineHeight: 1 }}>
                            {session.user?.name || "Account"}
                          </Text>
                        </Group>
                      }
                    />
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Account</Menu.Label>
                    <Menu.Item
                      leftSection={<IconUserEdit size={14} />}
                      onClick={() => setContactModalOpened(true)}
                    >
                      Update Contact Details
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={<IconLogout2 size={14} />}
                      onClick={() => {
                        sendGAEvent("event", "logout", {});
                        signOut();
                      }}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <NavLink
                  leftSection={<IconLogin2 size={18} />}
                  label="Login"
                  onClick={() => signIn()}
                />
              )}
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <UpdateContactModal
        isOpen={contactModalOpened}
        onClose={() => setContactModalOpened(false)}
        initialData={
          sessionData?.user?.Contacts
            ? {
                discord: sessionData.user.Contacts.discord || null,
                facebook: sessionData.user.Contacts.facebook || null,
                twitter: sessionData.user.Contacts.twitter || null,
                instagram: sessionData.user.Contacts.instagram || null,
                reddit: sessionData.user.Contacts.reddit || null,
              }
            : null
        }
      />
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
          <NavLink
            onClick={close}
            component={Link}
            label="Community Tierlist"
            href="/tierlist/community"
            active={pathname === "/tierlist/community"}
            prefetch
          />
          {session && (
            <NavLink
              component={Link}
              label="Dragon Dashboard"
              href="/dashboard"
              prefetch={false}
              active={pathname === "/dashboard"}
              onClick={() => {
                close();
                sendGAEvent("event", "dashboard-click", {});
              }}
            />
          )}
          {session && (
            <NavLink
              component={Link}
              label={
                <Group gap="xs" wrap="nowrap">
                  <span>Trading Hub</span>
                </Group>
              }
              href="/trading-hub/me"
              prefetch={false}
              active={pathname.startsWith("/trading-hub")}
              onClick={() => {
                close();
                sendGAEvent("event", "trading-hub-click", {});
              }}
            />
          )}
        </AppShell.Section>
        <AppShell.Section>
          <NavLink
            href="https://buymeacoffee.com/8obtn6i2fc"
            leftSection={<IconTipJar color="#FFD700" />}
            target="_blank"
            label="Donate"
            onClick={() => {
              close();
              sendGAEvent("event", "donate-click", {});
            }}
          />
          <NavLink
            label="Discord"
            leftSection={<IconBrandDiscordFilled color="#5865F2" />}
            href="https://discord.gg/U8CyQYpnWT"
            target="_blank"
            onClick={() => {
              close();
              sendGAEvent("event", "discord-click", {});
            }}
          />
          {session ? (
            <>
              <NavLink
                label="Update Contact Details"
                leftSection={<IconUserEdit size={18} />}
                onClick={() => {
                  setContactModalOpened(true);
                  close();
                }}
              />
              <NavLink
                color="red"
                label="Logout"
                leftSection={<IconLogout2 size={18} />}
                onClick={() => {
                  close();
                  sendGAEvent("event", "logout", {});
                  signOut();
                }}
              />
            </>
          ) : (
            <NavLink
              label="Login"
              leftSection={<IconLogin2 size={18} />}
              onClick={() => {
                close();
                signIn();
              }}
            />
          )}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <AppShell.Footer>
        <Group fz="xs" justify="center">
          <Link href="/terms">Terms & Conditions</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link
            href="https://buymeacoffee.com/8obtn6i2fc"
            target="_blank"
            onClick={() => {
              sendGAEvent("event", "donate-click", {});
            }}
          >
            Donate
          </Link>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
};

export default BasicAppShell;
