"use client";

import React from "react";
import { Alert, Box, Button, Checkbox, Link, Snackbar, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { FormLoginProps } from "./interface";
import Input from "@/components/FormControl/Input";
import { MailIcon } from "@/components/Icons";
import Card from "@/components/Cards/Card";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchemaFormData } from "@/schemas/loginSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser } from "@/context/AuthContext";

export function FormLogin({}: FormLoginProps) {
  const { login, isLoadingLogin } = useUser();
  const searchParams = useSearchParams();
  const authError = searchParams.get("authError");
  const from = searchParams.get("from");
  const [openAuthSnackbar, setOpenAuthSnackbar] = React.useState(false);

  React.useEffect(() => {
    setOpenAuthSnackbar(authError === "unauthorized");
  }, [authError]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaFormData) => {
    await login(data);
  };

  return (
    <Box
      bgcolor={"primary.main"}
      height="100%"
      position="relative"
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Snackbar
        open={openAuthSnackbar}
        autoHideDuration={6000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setOpenAuthSnackbar(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 2, mr: 2 }}
      >
        <Alert
          severity="warning"
          onClose={() => setOpenAuthSnackbar(false)}
          sx={{
            width: "100%",
            maxWidth: 380,
            boxShadow: "0 8px 18px rgba(16,24,40,0.10)",
            borderRadius: 2,
            "& .MuiAlert-message": {
              fontSize: 14,
              lineHeight: 1.35,
            },
          }}
        >
          Faça login para continuar
          {from ? ` em ${from}` : ""}.
        </Alert>
      </Snackbar>

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
          <Typography
            variant="h4"
            color="primary.contrastText"
            fontWeight={"400"}
          >
            Mennu
          </Typography>
        </Stack>
        <Stack alignItems="center" gap={1} width="100%">
          <Typography variant="h4" fontWeight={"600"}>
            Bem-vindo de volta
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            fontWeight={"400"}
          >
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
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={"400"}
            >
              Lembrar-me
            </Typography>
          </Stack>
          <Link
            component={NextLink}
            href="/passwordreset"
            color="background.auth"
            underline="none"
          >
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
          loading={isLoadingLogin}
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
