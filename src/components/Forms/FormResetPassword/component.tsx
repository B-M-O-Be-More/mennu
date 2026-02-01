"use client";

import { useRouter } from "next/navigation";
import {
  Stack,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { ArrowBack, MailOutline } from "@mui/icons-material";
import { FormResetPasswordProps } from "./interface";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema, ResetPasswordSchemaFormData } from "@/schemas/resetSchema";
import IconBox from "@/components/Cards/IconBox";
import Input from "@/components/FormControl/Input";


export function FormResetPassword({ onBack, onSubmit }: FormResetPasswordProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchemaFormData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleFormSubmit = async (data: ResetPasswordSchemaFormData) => {
    await onSubmit?.(data.email);
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{
        bgcolor: "background.paper",
        borderRadius: 4,
        p: 5,
        maxWidth: 600,
        width: "100%",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
      gap={2}
    >
      <Button
        onClick={() => {
          if (onBack) return onBack();
          router.push("/");
        }}
        startIcon={<ArrowBack sx={{ fontSize: 20 }} />}
        variant="text"
        sx={{
          alignSelf: "flex-start",
          color: "text.secondary",
          textTransform: "none",
          fontSize: "1rem",
          p: 0,
          transition: "0.2s",
          "&:hover": {
            bgcolor: "transparent",
            color: "#333",
            textShadow: "0 0 5px rgba(0,0,0,0.1)",
            transform: "translateX(-2px)",
          },
        }}
      >
        Voltar ao login
      </Button>

      <IconBox
        icon={<MailOutline sx={{ color: "#1976D2", width: 42, height: 42 }} />}
        bgColor="#E3F2FD"
        padding={2}
        borderRadius={"100%"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
        }}
      />
      <Stack alignItems="center" gap={1} width="100%">
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          Recuperar Senha
        </Typography>

        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{
            textAlign: "center",
          }}
        >
          Insira seu e-mail cadastrado e enviaremos um link para redefinir sua senha
        </Typography>
      </Stack>

      <Input
        icon={<MailOutline sx={{ color: "#BBB", fontSize: 22 }} />}
        label="E-mail"
        placeholder="seu@email.com"
        type="email"
        register={register("email")}
        error={errors.email?.message}
      />

      <Button
        type="submit"
        fullWidth
        disabled={isSubmitting}
        variant="contained"
        sx={{
          textTransform: "none",
          fontSize: "1.1rem",
          fontWeight: 600,
          boxShadow: "none",
          "&:disabled": {
            bgcolor: "#FFB4A3",
            color: "white",
          },
        }}
      >
        {isSubmitting ? "Enviando..." : "Enviar Link de Recuperação"}
      </Button>
    </Stack>
  );
}
