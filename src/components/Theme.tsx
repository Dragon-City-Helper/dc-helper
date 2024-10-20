"use client";
import { MantineProvider, DEFAULT_THEME } from "@mantine/core";
import { FC, PropsWithChildren } from "react";

const Theme: FC<PropsWithChildren> = ({ children }) => {
  return (
    <MantineProvider theme={DEFAULT_THEME} defaultColorScheme="dark">
      {children}
    </MantineProvider>
  );
};

export default Theme;
