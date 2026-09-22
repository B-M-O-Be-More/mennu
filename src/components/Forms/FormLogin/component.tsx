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
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        // minHeight (e não height) + centralização por flex: em telas baixas
        // (celular deitado, teclado aberto) o card cresce e a `<main>` rola,
        // em vez de ficar cortado como acontecia com o posicionamento
        // absoluto com translate.
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, sm: 6 },
      }}
    >
      <Snackbar
        open={openAuthSnackbar}
        autoHideDuration={6000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setOpenAuthSnackbar(false);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 2, mr: { xs: 0, sm: 2 } }}
      >
        <Alert
          severity="warning"
          onClose={() => setOpenAuthSnackbar(false)}
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: 380 },
            boxShadow: "0 8px 18px rgba(16,24,40,0.10)",
            borderRadius: 2,
            "& .MuiAlert-message": {
              fontSize: { xs: 13, sm: 14 },
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
        width={"100%"}
        padding={{ xs: 2.5, sm: 3, md: 4 }}
        spacing={{ xs: 1.5, sm: 2 }}
        sx={{
          // O Card padrão vem com `flex: 1` — dentro do flex container acima
          // isso esticaria o card na altura toda.
          flex: "0 0 auto",
          maxWidth: { xs: "100%", sm: 500, md: 580 },
        }}
      >
        <Stack
          bgcolor={"primary.main"}
          borderRadius={3}
          alignItems="center"
          paddingX={{ xs: 3, sm: 4 }}
          paddingY={{ xs: 1.25, sm: 2 }}
        >
          <Typography
            variant="h4"
            color="primary.contrastText"
            fontWeight={"400"}
            fontSize={{ xs: 24, sm: 28, md: 32 }}
          >
            Mennu
          </Typography>
        </Stack>
        <Stack alignItems="center" gap={0.5} width="100%">
          <Typography
            variant="h4"
            fontWeight={"600"}
            textAlign="center"
            fontSize={{ xs: 20, sm: 24, md: 28 }}
          >
            Bem-vindo de volta
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            fontWeight={"400"}
            textAlign="center"
            fontSize={{ xs: 13, sm: 14 }}
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
          flexWrap="wrap"
          rowGap={0.5}
          width={"100%"}
        >
          <Stack direction={"row"} alignItems={"center"}>
            <Checkbox
              defaultChecked
              sx={{
                p: { xs: 0.75, sm: 1 },
                "&.Mui-checked": { color: "primary.main" },
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={"400"}
              fontSize={{ xs: 13, sm: 14 }}
            >
              Lembrar-me
            </Typography>
          </Stack>
          <Link
            component={NextLink}
            href="/passwordreset"
            color="background.auth"
            underline="none"
            fontSize={{ xs: 13, sm: 14 }}
          >
            Esqueci minha senha
          </Link>
        </Stack>
        <Button
          sx={{
            width: "100%",
            height: { xs: "3.25rem", sm: "3.5rem", md: "4rem" },
            fontWeight: 400,
          }}
          variant="contained"
          type="submit"
          loading={isLoadingLogin}
        >
          Entrar
        </Button>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          fontSize={{ xs: 11, sm: 13 }}
        >
          Mennu © 2025 — Sistema de Gestão de Refeições
        </Typography>
      </Card>
    </Box>
  );
}
