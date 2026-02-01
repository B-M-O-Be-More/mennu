"use client";

import { Box, Button, Checkbox, Link, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import { FormLoginProps } from "./interface";
import Input from "@/components/FormControl/Input";
import { MailIcon } from "@/components/Icons";
import Card from "@/components/Cards/Card";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchemaFormData } from "@/schemas/loginSchema";
import { yupResolver } from "@hookform/resolvers/yup";

export function FormLogin({ }: FormLoginProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaFormData>(
    {
      resolver: yupResolver(loginSchema),
      defaultValues:
      {
        email: "",
        password: "",
      },
    }
  );

  const onSubmit = (data: LoginSchemaFormData) => {
    console.log("Login:", data);
  };

  return (
    <Box bgcolor={"primary.main"} height="100%" position="relative" component={"form"}
      onSubmit={handleSubmit(onSubmit)}>
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
          <Typography variant="h4" color="primary.contrastText" fontWeight={"400"}>
            Mennu
          </Typography>
        </Stack>
        <Stack alignItems="center" gap={1} width="100%">
          <Typography variant="h4" fontWeight={"600"}>
            Bem-vindo de volta
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={"400"}>
            Acesse sua conta para continuar
          </Typography>
        </Stack>

        <Input
          icon={<MailIcon width={18} height={18} />}
          label="E-mail"
          placeholder="seu@email.com"
          register={register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          register={register("password")}
          error={errors.password?.message}
        />

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
          type="submit"
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
