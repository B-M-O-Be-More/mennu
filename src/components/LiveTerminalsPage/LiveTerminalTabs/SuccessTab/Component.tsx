import { Divider, Grid, Stack, Typography, useTheme } from "@mui/material";
import { SuccessTabProps } from "./";
import IconBox from "@/components/Cards/IconBox/Component";
import { CircledCheckIcon } from "@/components/Icons";
import React from "react";
import { IUser } from "@/Interfaces/User/user";
import { formatDate } from "@/utils/formatDate";

const mockUser: IUser = {
  id: 6905,
  nome: "João da Silva",
  email: "joao.silva@example.com",
  cpf: "123.456.789-00",
  matricula: "USR-6905",
  tipo_usuario: "funcionario",
  status: true,
  status_acesso: true,
  numero_cartao: "CARD-123456",
  unidade: "Sede São Paulo",
  updated_at: "2025-12-04T14:30:22Z",
  empresa_id: null,
  feature_flags: [],
  token_access: {
    token: "abcdef1234567890",
    expirado_em: "2026-12-04T14:30:22Z",
  },
  ultima_refeicao: null,
}

export default function SuccessTab({ setTab }: SuccessTabProps) {
  const theme = useTheme();

  const [count, setCount] = React.useState(3);

  React.useEffect(() => {
    if (count === 0) {
      setTimeout(() => {
        setTab(0);
        return;
      }, 1000);
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, setTab]);

  return (
    <Stack flex={1} alignItems="center" justifyContent="center">
      <Stack
        alignItems="center"
        gap={2.6}
        bgcolor="background.paper"
        width={{ xs: "90%", sm: "70%", md: "52%", lg: "40%" }}
        borderRadius={6}
        px={{ xs: 2, md: 5 }}
        py={{ xs: 3, md: 5 }}
        border={"1px solid"}
        borderColor="success.contrastText"
      >
        <IconBox
          icon={<CircledCheckIcon height={60} width={60} color={theme.palette.success.contrastText} />}
          bgColor="success.main"
          borderRadius="100%"
          padding={5}
        />
        <Typography variant="h5" fontWeight="600" textAlign="center">
          Acesso Autorizado
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Bem-vindo ao restaurante! Aproveite sua refeição.
        </Typography>

        <Divider sx={{ borderColor: "grey.100", width: "100%", my: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack bgcolor="background.default" borderRadius={3} py={1} px={2}>
              <Typography variant="caption" color="default.contrastText">
                Usuário
              </Typography>
              <Typography>{mockUser.nome}</Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack bgcolor="background.default" borderRadius={3} py={1} px={2}>
              <Typography variant="caption" color="default.contrastText">
                ID
              </Typography>
              <Typography>{mockUser.matricula}</Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack bgcolor="background.default" borderRadius={3} py={1} px={2}>
              <Typography variant="caption" color="default.contrastText">
                Terminal
              </Typography>
              <Typography>
                Terminal Térreo - Entrada Principal • Sede São Paulo
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Stack bgcolor="background.default" borderRadius={3} py={1} px={2}>
              <Typography variant="caption" color="default.contrastText">
                Método
              </Typography>
              <Typography>NFC</Typography>
            </Stack>
          </Grid>

          <Grid size={12}>
            <Stack bgcolor="background.default" borderRadius={3} py={1} px={2}>
              <Typography variant="caption" color="default.contrastText">
                Data/Hora
              </Typography>
              <Typography>{formatDate(new Date(mockUser.updated_at), "dd/MM/yyyy, hh:mm:ss")}</Typography>
            </Stack>
          </Grid>
        </Grid>


        <Typography variant="body2" color="text.secondary">
          Retornando em {count} segundos...
        </Typography>
      </Stack>
    </Stack >
  );
}