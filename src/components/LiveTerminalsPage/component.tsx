"use client";

import { Stack, Typography, useTheme, Box, Button } from "@mui/material";
import { LiveTerminalsPageProps } from "./";
import { ClockIcon, WifiIcon } from "../Icons";
import { formatDate } from "@/utils/formatDate";
import { ErrorTab, MainTab, SuccessTab } from "./LiveTerminalTabs/";
import NextLink from "next/link";

import React from "react";

const mockTerminal = {
  id: "1",
  nome: "Terminal A",
  codigo: "TRM-001",
  unidade: "Unidade 1",
  tipo: "Principal",
  status: "online",
  ultimaSync: "04/12/2025 14:30:22",
  refeicoesPermitidas: ["Café da Manhã", "Almoço", "Jantar"],
  categoriasPermitidas: ["Funcionários", "Visitantes"],
  ativo: true,
}

export function LiveTerminalsPage({ }: LiveTerminalsPageProps) {
  const theme = useTheme();

  const [tab, setTab] = React.useState(0);
  const [time, setTime] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Stack minHeight="100vh" gap={2}>
      <Stack
        bgcolor="background.paper"
        direction={{ xs: "column", md: "row" }}
        gap={2}
        py={3}
        px={{ xs: 2, md: 6 }}
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor="divider"
        width="100%"
        alignItems={{ xs: "flex-start", md: "center" }}
      >
        <Stack direction="row" gap={3} alignItems="center">
          <Button
            variant="contained"
            component={NextLink}
            href={"/terminal"}
            sx={{
              borderRadius: 4,
              px: { xs: 2, md: 4 },
              py: 1,
            }}
          >
            <Typography variant="h6" color="primary.contrastText">
              Mennu
            </Typography>
          </Button>
          <Box>
            <Typography variant="h5" color="text.primary" fontWeight={"400"}>
              Terminal de Refeições
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={"400"}>
              {mockTerminal.nome} • {mockTerminal.unidade}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <ClockIcon height={26} width={26} color={theme.palette.text.label} />
          <Typography variant="h5" color="text.label">
            {time ? formatDate(time, "hh:mm:ss") : "--:--:--"}
          </Typography>
        </Stack>
      </Stack>

      {tab === 0 && <MainTab />}
      {tab === 1 && <SuccessTab setTab={setTab} />}
      {tab === 2 && <ErrorTab setTab={setTab} />}

      <Stack
        gap={2}
        alignItems="center"
        direction="row"
        width="100%"
        borderTop="1px solid"
        borderColor="divider"
        bgcolor="background.paper"
        justifyContent="space-between"
        py={3}
        px={{ xs: 6, md: 12 }}
      >
        <Stack direction="row" alignItems="center" gap={2}>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <WifiIcon color={theme.palette.success.contrastText} />
            <Typography variant="body2" color="success.contrastText">
              Conectado
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Versão 2.1.0
          </Typography>
        </Stack>
        <Typography variant="body2" color="grey.400">
          Mennu © 2025 — Sistema de Gestão de Refeições
        </Typography>
      </Stack>
    </Stack>
  );
}
