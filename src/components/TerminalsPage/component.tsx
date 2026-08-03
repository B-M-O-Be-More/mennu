"use client";

import { Stack, Typography, useTheme, Box, Alert } from "@mui/material";
import { TerminalsPageProps } from "./";
import { ClockIcon, TerminalIcon } from "../Icons";
import { formatDate } from "@/utils/formatDate";
import React from "react";
import IconBox from "../Cards/IconBox";
import TerminalCard from "./TerminalCard";
import { ITerminal, mapApiTerminalToUi, TerminalStatus } from "@/Interfaces/Terminal/terminal";
import { TerminalSocketEvent } from "@/hooks/useTerminalSocket/interface";
import { useTerminalSocket } from "@/hooks/useTerminalSocket/hook";

interface ISede {
  id: number;
  nome: string;
  terminals: ITerminal[];
}

const LIST_POLL_INTERVAL_MS = 20000;

export function TerminalsPage({}: TerminalsPageProps) {
  const theme = useTheme();

  const [time, setTime] = React.useState<Date | null>(null);
  const [terminais, setTerminais] = React.useState<ITerminal[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const loadTerminais = async () => {
      setError(null);
      try {
        const response = await fetch("/api/terminais");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Erro ao carregar terminais");
        }
        const results = data.results ?? data;
        if (!cancelled) setTerminais(results.map(mapApiTerminalToUi));
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Erro ao carregar terminais");
        }
      }
    };

    // Polling sequencial: cada volta só é agendada depois que a anterior
    // termina, nunca duas chamadas de GET /api/terminais em paralelo. Status
    // continua vindo só do WebSocket — isso aqui só mantém a lista em dia
    // (terminal criado/removido pelo admin).
    const loop = async () => {
      await loadTerminais();
      if (cancelled) return;
      timeoutId = setTimeout(loop, LIST_POLL_INTERVAL_MS);
    };
    loop();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  const handleSocketEvent = React.useCallback((event: TerminalSocketEvent) => {
    if (event.type !== "status_update") return;

    setTerminais((prev) =>
      prev.map((terminal) =>
        terminal.id === event.terminal_id
          ? {
              ...terminal,
              status: (event.status as TerminalStatus) ?? terminal.status,
              ultimoPing: (event.ultimo_ping as string) ?? terminal.ultimoPing,
            }
          : terminal,
      ),
    );
  }, []);

  useTerminalSocket({ onEvent: handleSocketEvent });

  const sedes = React.useMemo<ISede[]>(() => {
    const map = new Map<number, ISede>();
    terminais.forEach((terminal) => {
      const unidadeId = terminal.unidadeId ?? -1;
      const existing = map.get(unidadeId);
      if (existing) {
        existing.terminals.push(terminal);
      } else {
        map.set(unidadeId, {
          id: unidadeId,
          nome: terminal.unidadeNome ?? "Sem unidade",
          terminals: [terminal],
        });
      }
    });
    return Array.from(map.values());
  }, [terminais]);

  return (
    <Stack gap={2} height="100%" maxHeight="100%">
      <Stack
        direction="row"
        justifyContent="space-between"
        gap={2}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Terminal de Refeições
        </Typography>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <ClockIcon height={26} width={26} color={theme.palette.text.label} />
          <Typography variant="h5" color="text.label">
            {time ? formatDate(time, "hh:mm:ss") : "--:--:--"}
          </Typography>
        </Stack>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Stack alignItems="center" width="100%" gap={2.6}>
        <IconBox
          icon={
            <TerminalIcon
              height={80}
              width={80}
              color={theme.palette.info.contrastText}
            />
          }
          bgColor="info.main"
          borderRadius="100%"
          sx={{
            padding: { xs: 3, md: 5 },
          }}
        />
        <Typography variant="h5" fontWeight="600" textAlign="center">
          Selecione o Terminal
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Escolha a unidade e o terminal correspondente para iniciar
        </Typography>
      </Stack>

      <Stack gap={3}>
        {sedes.map((sede) => (
          <Box key={sede.id}>
            <Typography variant="h6" mb={2}>
              {sede.nome}
            </Typography>
            <Stack
              direction="row"
              gap={2}
              flexWrap="wrap"
              justifyContent={{ xs: "center", sm: "flex-start" }}>
              {sede.terminals.map((terminal) => (
                <TerminalCard key={terminal.id} terminal={terminal} />
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
