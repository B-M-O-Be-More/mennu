"use client";

import React from "react";
import dayjs from "dayjs";
import { Button, Stack, TextField, Typography } from "@mui/material";
import PageHeader from "../PageHeader";
import { RelatoriosIcon, UpdateIcon } from "../Icons";
import TabButton from "../TabButton";
import { useRelatoriosDisponiveis } from "@/hooks/useRelatoriosDisponiveis/hook";
import { RelatorioTab } from "./Tabs/RelatorioTab/component";

function _defaultRange() {
  return {
    dataInicio: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    dataFim: dayjs().format("YYYY-MM-DD"),
  };
}

export function ReportsPage() {
  const modulos = useRelatoriosDisponiveis();
  const [activeTab, setActiveTab] = React.useState(0);
  const [range, setRange] = React.useState(_defaultRange);

  const moduloAtivo = modulos[activeTab] ?? null;

  React.useEffect(() => {
    setActiveTab(0);
  }, [modulos.length]);

  if (modulos.length === 0) {
    return (
      <Stack gap={2}>
        <PageHeader
          title="Relatórios"
          subtitle="Histórico de consumo e análises do sistema"
        />
        <Stack
          alignItems="center"
          justifyContent="center"
          gap={2}
          py={8}
          sx={{ border: "1px dashed", borderColor: "divider", borderRadius: 3 }}>
          <RelatoriosIcon height={48} />
          <Typography variant="h6" color="text.secondary">
            Nenhum módulo de relatório disponível
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" maxWidth={400}>
            Relatórios são liberados de acordo com o plano contratado.
            Faça upgrade para acessar análises de consumo, estoque, acesso e mais.
          </Typography>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack gap={2}>
      <PageHeader
        title="Relatórios"
        subtitle="Histórico de consumo e análises do sistema"
      />

      {/* Date range filter */}
      <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
        <TextField
          label="Data início"
          type="date"
          size="small"
          value={range.dataInicio}
          onChange={(e) =>
            setRange((prev) => ({ ...prev, dataInicio: e.target.value }))
          }
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160 }}
        />
        <TextField
          label="Data fim"
          type="date"
          size="small"
          value={range.dataFim}
          onChange={(e) =>
            setRange((prev) => ({ ...prev, dataFim: e.target.value }))
          }
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160 }}
        />
        <Button
          variant="outlined"
          size="small"
          startIcon={<UpdateIcon height={18} />}
          onClick={() => setRange(_defaultRange())}>
          Últimos 30 dias
        </Button>
      </Stack>

      {/* Tab buttons */}
      <Stack
        direction="row"
        gap={2}
        sx={{
          overflowX: "auto",
          pb: 0.5,
          flexShrink: 0,
          "&::-webkit-scrollbar": { height: 0 },
          scrollbarWidth: "none",
        }}>
        {modulos.map((modulo, index) => (
          <TabButton
            key={modulo.id}
            label={modulo.label}
            icon={<RelatoriosIcon height={24} />}
            tabIndex={index}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        ))}
      </Stack>

      {/* Active tab content */}
      {moduloAtivo && (
        <RelatorioTab
          key={moduloAtivo.id}
          modulo={moduloAtivo}
          dataInicio={range.dataInicio}
          dataFim={range.dataFim}
        />
      )}
    </Stack>
  );
}
