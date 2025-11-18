"use client";

import { Container, Stack } from "@chakra-ui/react";
import { MainLayoutProps } from "./interface";
import HeaderComponent from "../Header";

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Stack h={"full"} w={"full"}>
      <HeaderComponent />
      <Container h={"full"} w={"full"}>
        {children}
      </Container>
    </Stack>
  );
}
