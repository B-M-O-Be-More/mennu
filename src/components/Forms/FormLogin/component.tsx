"use client";

import { Button, Checkbox, Link, Stack, Typography } from "@mui/material";
import { FormLoginProps } from "./interface";
import { Input } from "@/components/FormControl/Input/component";
import { MdOutlineEmail, FiLock } from "@/components/Icons";

export function FormLogin({}: FormLoginProps) {
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
        <Stack
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
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Checkbox
              defaultChecked
              sx={{
                "&.Mui-checked": { color: "#FF3D00" },
              }}
            />
            <Typography fontSize={"18px"} color="#4A5565" fontWeight={"400"}>
              Lembrar-me
            </Typography>
          </Stack>
          <Link href="#" color="background.auth" underline="none">
            Esqueci minha senha
          </Link>
        </Stack>
        <Button
          sx={{
            width: "100%",
            borderRadius: "17px",
            height: "66px",
          }}
          variant="contained"
        >
          Entrar
        </Button>
      </Stack>
      <Typography fontSize={"18px"} color="#99A1AF">
        Mennu © 2025 — Sistema de Gestão de Refeições
      </Typography>
    </Stack>
  );
}
