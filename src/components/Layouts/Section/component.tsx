"use client";

import { Stack } from "@chakra-ui/react";
import { SectionComponentProps } from "./interface";

export function SectionComponent({ children, ...rest }: SectionComponentProps) {
  return (
    <Stack
      as="section"
      w="full"
      pt={"80px"}
      h={{ base: "100dvh", md: "100vh" }}
      direction={{ base: "column", md: "row" }}
      alignItems="center"
      justifyContent={{ base: "center", md: "space-around" }}
      px={{ base: 6, md: 12 }}
      bg="transparent"
      {...rest}
    >
      {children}
    </Stack>
  );
}
