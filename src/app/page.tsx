"use client";

import FormLogin from "@/components/Forms/FormLogin";
import Stack from "@mui/material/Stack";

export default function Home() {
  return (
    <Stack
      width={"full"}
      height="100vh"
      bgcolor={"background.auth"}
      justifyContent="center"
      alignItems="center"
      padding={"10px"}
    >
      <FormLogin />
    </Stack>
  );
}
