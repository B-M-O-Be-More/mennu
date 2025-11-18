"use client";

import { ColorModeButton } from "@/components/ui/color-mode";
import { Button, Container, Heading, HStack, Stack } from "@chakra-ui/react";
import { LuLogIn, LuUserPlus } from "@/components/Icons";
import { HeaderComponentProps } from "./interface";
import LoginModal from "@/components/Modals/LoginModal/component";
import RegisterModal from "@/components/Modals/RegisterModal/component";

export function HeaderComponent({}: HeaderComponentProps) {
  return (
    <Stack
      as="header"
      position="fixed"
      top="0"
      left="0"
      w="full"
      h="80px"
      zIndex="overlay"
      bg="white"
      _dark={{
        bg: "#000000",
        boxShadow: "0 4px 15px rgba(255,255,255,0.05)",
      }}
      boxShadow="0 4px 10px rgba(0,0,0,0.1)"
      transition="background-color 0.2s ease"
    >
      <Container maxW="8xl" h="full">
        <HStack w="full" h="full" justifyContent="space-between">
          <Heading size="md">Logo</Heading>

          <HStack gap={4}>
            <ColorModeButton />
            <LoginModal />
            <RegisterModal />
          </HStack>
        </HStack>
      </Container>
    </Stack>
  );
}
