"use client";

import { AppShell, Burger, Center, Group, NavLink, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import Logo from "./Logo";
import { FC, PropsWithChildren } from "react";

const BasicAppShell: FC<PropsWithChildren> = ({ children }) => {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { desktop: !opened, mobile: !opened },
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
        <NavLink component={Link} label="Home" href="/home" />
        <NavLink component={Link} label="Tierlist" href="/tierlist" />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
      <AppShell.Footer>
        <Text fz="xs" ta="center">
          This page is not affiliated with Dragon City, or SocialPoint SL.
          Copyrights belong to their respective owners
        </Text>
      </AppShell.Footer>
    </AppShell>
  );
};

export default BasicAppShell;
