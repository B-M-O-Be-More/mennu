"use client";

import SectionComponent from "@/components/Layouts/Section";
import { Stack, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Stack w="full" gap={0}>
      <SectionComponent>
        <Text>HomePage</Text>
      </SectionComponent>
    </Stack>
  );
}
