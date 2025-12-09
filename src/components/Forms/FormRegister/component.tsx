"use client";

import { Stack, Typography } from "@mui/material";

export function FormRegister() {
  return (
    <Stack
      alignItems="center"
      justifyContent="space-between"
      bgcolor={"background.default"}
      maxWidth={"600px"}
      width={"100%"}
      borderRadius={"24px"}
      spacing={3}
      padding={"24px"}
    >
      <Stack width={"100%"} alignItems="center" gap={2}>
        {/* <Stack
          width={"176px"}
          height={"80px"}
          bgcolor={"background.auth"}
          borderRadius={"16px"}
          alignItems="center"
          justifyContent="center"
        >
          <Typography fontSize={"38px"} color="white">
            Mennu
          </Typography>
        </Stack>
        <Typography fontSize={"40px"} fontWeight={"600"}>
          Bem-vindo de volta
        </Typography>
        <Typography fontSize={"18px"} color="text.secondary" fontWeight={"400"}>
          Acesse sua conta para continuar
        </Typography>

        <Stack width={"100%"} spacing={2}>
          <Input startIcon={<MdOutlineEmail />} label="E-mail" />
          <Input startIcon={<FiLock />} label="Senha" type="password" />
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent="space-between"
          width={"100%"}
        ></Stack>
        <Button
          sx={{
            width: "100%",
            borderRadius: "17px",
            height: "66px",
          }}
          variant="contained"
        >
          Entrar
        </Button> */}
      </Stack>
      <Typography fontSize={"18px"} color="#99A1AF">
        Mennu © 2025 — Sistema de Gestão de Refeições
      </Typography>
    </Stack>
  );
}
