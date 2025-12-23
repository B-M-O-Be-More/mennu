"use client";

import { useState } from "react";
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

export function FormResetPassword({
  onBack,
  onSubmit,
}: FormResetPasswordProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit?.(email);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      sx={{
        bgcolor: "#FFFF",
        borderRadius: 4,
        p: 5,
        maxWidth: 750,
        width: "100%",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
      spacing={0}
    >
      {/* Botão Voltar */}
      <Box sx={{ mb: 5, alignSelf: "flex-start" }}>
        <Button
          onClick={() => {
            if (onBack) return onBack();
            router.push("/");
          }}
          startIcon={<ArrowBack sx={{ fontSize: 20 }} />}
          sx={{
            color: "#666",
            textTransform: "none",
            fontSize: "1rem",
            p: 0,
            minWidth: "auto",
            "&:hover": { 
              bgcolor: "transparent",
              color: "#333"
            },
          }}
        >
          Voltar ao login
        </Button>
      </Box>

      {/* Ícone de Email */}
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          bgcolor: "#E3F2FD",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          alignSelf: "center",
        }}
      >
        <MailOutline sx={{ fontSize: 36, color: "#1976D2" }} />
      </Box>

      {/* Título */}
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          color: "#1A1A1A",
          mb: 2.5,
          fontSize: "2.5rem",
          textAlign: "center",
        }}
      >
        Recuperar Senha
      </Typography>

      {/* Descrição */}
      <Typography
        variant="body1"
        sx={{
          color: "#999",
          mb: 4,
          lineHeight: 1.6,
          fontSize: "1.05rem",
          textAlign: "center",
          px: 4,
        }}
      >
        Insira seu e-mail cadastrado e enviaremos um link para redefinir sua senha
      </Typography>

      {/* Campo de Email */}
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Typography
          variant="body1"
          sx={{
            color: "#333",
            fontWeight: 500,
            fontSize: "1rem",
          }}
        >
          E-mail
        </Typography>
        <TextField
          fullWidth
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          InputProps={{
            startAdornment: (
              <MailOutline
                sx={{ color: "#BBB", mr: 1.5, fontSize: 22 }}
              />
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "white",
              borderRadius: 3,
              border: "1px solid #E0E0E0",
              "& fieldset": {
                border: "none",
              },
              "&:hover": {
                borderColor: "#D0D0D0",
              },
              "&.Mui-focused": {
                borderColor: "#C0C0C0",
              },
              "& input": {
                py: 2,
                fontSize: "1rem",
                color: "#BBB",
              },
              "& input::placeholder": {
                color: "#BBB",
                opacity: 1,
              },
            },
          }}
        />
      </Stack>

      {/* Botão de Enviar */}
      <Button
        type="submit"
        fullWidth
        disabled={loading}
        sx={{
          bgcolor: "#FF3D00",
          color: "white",
          py: 2.25,
          borderRadius: 3,
          textTransform: "none",
          fontSize: "1.1rem",
          fontWeight: 600,
          boxShadow: "none",
          mt: 2,
          "&:hover": {
            bgcolor: "#F4511E",
            boxShadow: "none",
          },
          "&:disabled": {
            bgcolor: "#FFB4A3",
            color: "white",
          },
        }}
      >
        {loading ? "Enviando..." : "Enviar Link de Recuperação"}
      </Button>
    </Stack>
  );
}