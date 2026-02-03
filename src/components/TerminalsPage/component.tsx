"use client";

import { Stack, Typography, useTheme, Box } from "@mui/material";
import { TerminalsPageProps } from "./";
import PageHeader from "../PageHeader";
import { ClockIcon, TerminalIcon } from "../Icons";
import { useClock } from "@/hooks/useClock/hook";
import { formatDate } from "@/utils/formatDate";
import React from "react";
import IconBox from "../Cards/IconBox";
import TerminalCard from "./TerminalCard"; // novo componente
import { ITerminal } from "@/Interfaces/Terminal/terminal";

export const mockTerminals: ITerminal[] = [
  {
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
  },
  {
    id: "2",
    nome: "Terminal B",
    codigo: "TRM-002",
    unidade: "Unidade 2",
    tipo: "Secundário",
    status: "offline",
    ultimaSync: "03/12/2025 09:15:10",
    refeicoesPermitidas: ["Almoço", "Jantar"],
    categoriasPermitidas: ["Funcionários"],
    ativo: false,
  },
  {
    id: "3",
    nome: "Terminal C",
    codigo: "TRM-003",
    unidade: "Unidade 3",
    tipo: "Principal",
    status: "offline",
    ultimaSync: "03/12/2025 09:15:10",
    refeicoesPermitidas: ["Jantar"],
    categoriasPermitidas: ["Gestor"],
    ativo: false,
  },
  {
    id: "4",
    nome: "Terminal D",
    codigo: "TRM-004",
    unidade: "Unidade 4",
    tipo: "Secundário",
    status: "online",
    ultimaSync: "04/12/2025 11:45:55",
    refeicoesPermitidas: ["Café da Manhã", "Almoço"],
    categoriasPermitidas: ["Funcionários", "Visitantes", "Gestor"],
    ativo: true,
  },
  {
    id: "5",
    nome: "Terminal E",
    codigo: "TRM-005",
    unidade: "Unidade 5",
    tipo: "Principal",
    status: "offline",
    ultimaSync: "02/12/2025 16:20:30",
    refeicoesPermitidas: ["Café da Manhã"],
    categoriasPermitidas: ["Visitantes"],
    ativo: false,
  },
  {
    id: "6",
    nome: "Terminal F",
    codigo: "TRM-006",
    unidade: "Unidade 6",
    tipo: "Secundário",
    status: "online",
    ultimaSync: "04/12/2025 13:10:05",
    refeicoesPermitidas: ["Almoço", "Jantar"],
    categoriasPermitidas: ["Funcionários", "Gestor"],
    ativo: true,
  },
  {
    id: "7",
    nome: "Terminal G",
    codigo: "TRM-007",
    unidade: "Unidade 7",
    tipo: "Principal",
    status: "offline",
    ultimaSync: "01/12/2025 08:05:45",
    refeicoesPermitidas: ["Café da Manhã", "Almoço", "Jantar"],
    categoriasPermitidas: ["Funcionários"],
    ativo: false,
  }
];

export const mockSedes: { id: string, nome: string, terminals: ITerminal[] }[] = [
  {
    id: "1",
    nome: "Sede São Paulo",
    terminals: mockTerminals
  },
  {
    id: "2",
    nome: "Sede Rio de Janeiro",
    terminals: [mockTerminals[3], mockTerminals[4]]
  },
  {
    id: "3",
    nome: "Sede Belo Horizonte",
    terminals: [mockTerminals[5], mockTerminals[6]]
  }
];

export function TerminalsPage({ }: TerminalsPageProps) {
  const theme = useTheme();
  const startDate = React.useMemo(() => new Date(), []);
  const now = useClock(startDate);

  return (
    <Stack gap={2} height="100%" maxHeight="100%">
      <PageHeader title="Terminal de Refeições">
        <Stack direction="row" alignItems="center" gap={1.5}>
          <ClockIcon height={26} width={26} color={theme.palette.text.label} />
          <Typography variant="h5" color="text.label">
            {formatDate(now, "hh:mm:ss")}
          </Typography>
        </Stack>
      </PageHeader>

      <Stack alignItems="center" width="100%" gap={2.6}>
        <IconBox
          icon={<TerminalIcon height={80} width={80} color={theme.palette.info.contrastText} />}
          bgColor="info.main"
          borderRadius="100%"
          sx={{
            padding: { xs: 3, md: 5 }
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
        {mockSedes.map((sede) => (
          <Box key={sede.id}>
            <Typography variant="h6" mb={2}>
              {sede.nome}
            </Typography>
            <Stack
              direction="row"
              gap={2}
              flexWrap="wrap"
              justifyContent={{ xs: "center", sm: "flex-start" }}
            >
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
