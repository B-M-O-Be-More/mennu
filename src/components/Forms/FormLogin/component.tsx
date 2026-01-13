"use client";

import { Box, Button, Checkbox, Link, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import { FormLoginProps } from "./interface";
import Input from "@/components/FormControl/Input";
import { MdOutlineEmail, FiLock } from "@/components/Icons";
import Card from "@/components/Cards/Card";
import React from "react";

export function FormLogin({ }: FormLoginProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <Box bgcolor={"primary.main"} height="100%" position="relative" >
      <Card
        alignItems="center"
        boxShadow={"0 25px 50px -12px rgba(0, 0, 0, 0.25)"}
        width={"500px"}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Stack
          bgcolor={"primary.main"}
          borderRadius={3}
          alignItems="center"
          paddingX={4}
          paddingY={2}
        >
          <Typography variant="h2" color="primary.contrastText" fontWeight={"400"}>
            Mennu
          </Typography>
        </Stack>
        <Typography variant="h2" fontWeight={"600"}>
          Bem-vindo de volta
        </Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={"400"}>
          Acesse sua conta para continuar
        </Typography>

        <Input icon={<MdOutlineEmail size={18} />} label="E-mail" placeholder="seu@email.com" onChange={setEmail} value={email} />
        <Input icon={<FiLock size={18} />} label="Senha" type="password" placeholder="••••••••" onChange={setPassword} value={password} />

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
                "&.Mui-checked": { color: "primary.main" },
              }}
            />
            <Typography variant="body2" color="text.secondary" fontWeight={"400"}>
              Lembrar-me
            </Typography>
          </Stack>
          <Link component={NextLink} href="/passwordreset" color="background.auth" underline="none">
            Esqueci minha senha
          </Link>
        </Stack>
        <Button
          sx={{
            width: "100%",
            height: "4rem",
            fontWeight: 400,
          }}
          variant="contained"
        >
          Entrar
        </Button>
        <Typography variant="body2" color="text.secondary">
          Mennu © 2025 — Sistema de Gestão de Refeições
        </Typography>
      </Card>
    </Box>
  );
}
