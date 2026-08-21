"use client";

import { Stack, Typography, useTheme, Box, Button, Alert } from "@mui/material";
import { LiveTerminalsPageProps } from "./";
import { ClockIcon, NoWifiIcon, WifiIcon } from "../Icons";
import { formatDate } from "@/utils/formatDate";
import { BlockedTab, ErrorTab, MainTab, SuccessTab } from "./LiveTerminalTabs/";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import { ITerminal, ITerminalAccessResult, mapApiTerminalToUi, TerminalStatus } from "@/Interfaces/Terminal/terminal";
import { TerminalSocketEvent } from "@/hooks/useTerminalSocket/interface";
import { useTerminalSocket } from "@/hooks/useTerminalSocket/hook";

import React from "react";

export function LiveTerminalsPage({ }: LiveTerminalsPageProps) {
  const theme = useTheme();
  const params = useParams<{ id: string }>();
  const terminalId = params?.id;

  const [tab, setTab] = React.useState(0);
  const [time, setTime] = React.useState<Date | null>(null);
  const [terminal, setTerminal] = React.useState<ITerminal | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [accessResult, setAccessResult] = React.useState<ITerminalAccessResult | undefined>(undefined);

  React.useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    // Best-effort: cobre navegação direta por URL/refresh. Se o navegador
    // recusar por falta de gesto do usuário, segue sem tela cheia — o card
    // em /terminal já dispara isso no clique, que é o caminho confiável.
    // Sair da tela cheia é responsabilidade do MainLayout (reage à troca de
    // rota, não ao mount/unmount deste componente — evita o efeito duplo do
    // Strict Mode em dev ligar e desligar a tela cheia na hora).
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, []);

  React.useEffect(() => {
    if (!terminalId) return;

    const loadTerminal = async () => {
      setError(null);
      try {
        const response = await fetch(`/api/terminais/${terminalId}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Erro ao carregar terminal");
        }
        setTerminal(mapApiTerminalToUi(data));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar terminal");
      }
    };

    loadTerminal();
  }, [terminalId]);

  const handleSocketEvent = React.useCallback(
    (event: TerminalSocketEvent) => {
      if (!terminalId || String(event.terminal_id) !== String(terminalId)) return;

      if (event.type === "status_update") {
        setTerminal((prev) =>
          prev
            ? {
                ...prev,
                status: (event.status as TerminalStatus) ?? prev.status,
                ultimoPing: (event.ultimo_ping as string) ?? prev.ultimoPing,
              }
            : prev,
        );
      }

      if (event.type === "access_result") {
        setAccessResult({
          authorized: Boolean(event.authorized),
          message: String(event.message ?? ""),
          usuarioNome: event.usuario_nome as string | undefined,
          usuarioMatricula: event.usuario_matricula as string | undefined,
          terminalNome: event.terminal_nome as string | undefined,
          unidadeNome: event.unidade_nome as string | undefined,
          timestamp: event.timestamp as string | undefined,
        });
        setTab(event.authorized ? 1 : 2);
      }
    },
    [terminalId],
  );

  const { connected } = useTerminalSocket({ onEvent: handleSocketEvent });

  const isConectado = terminal?.status === "online";

  return (
    <Stack minHeight="100dvh" gap={2}>
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
              {terminal ? `${terminal.nome} • ${terminal.unidadeNome}` : "Carregando..."}
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

      {error && (
        <Box px={{ xs: 2, md: 6 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!connected && (
        <Box px={{ xs: 2, md: 6 }}>
          <Alert severity="warning">Conexão em tempo real indisponível. Tentando reconectar...</Alert>
        </Box>
      )}

      {tab === 0 && (terminal && terminal.status !== "online" ? <BlockedTab status={terminal.status} /> : <MainTab />)}
      {tab === 1 && <SuccessTab setTab={setTab} accessResult={accessResult} />}
      {tab === 2 && <ErrorTab setTab={setTab} accessResult={accessResult} />}

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
            {isConectado ? (
              <WifiIcon color={theme.palette.success.contrastText} />
            ) : (
              <NoWifiIcon color={theme.palette.error.contrastText} />
            )}
            <Typography variant="body2" color={isConectado ? "success.contrastText" : "error.contrastText"}>
              {isConectado ? "Conectado" : "Desconectado"}
            </Typography>
          </Stack>
          {terminal?.versaoSoftware && (
            <Typography variant="body2" color="text.secondary">
              Versão {terminal.versaoSoftware}
            </Typography>
          )}
        </Stack>
        <Typography variant="body2" color="grey.400">
          Mennu © 2025 — Sistema de Gestão de Refeições
        </Typography>
      </Stack>
    </Stack>
  );
}
