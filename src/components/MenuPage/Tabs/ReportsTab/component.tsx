"use client";

import Card from "@/components/Cards/Card";
import InfoCard from "@/components/Cards/InfoCard";
import { CalendarIcon, PaperIcon, RefeicoesIcon, StatsIcon, TwistedArrowIcon } from "@/components/Icons";
import Table from "@/components/Tables/Table";
import { Alert, Box, CircularProgress, Stack, Typography, useTheme } from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import React from "react";
import { ReportsTabProps } from ".";
import { reportsMenuColumns } from "@/data/tableColumns";
import Select from "@/components/FormControl/Select";
import DatePicker from "@/components/FormControl/DatePicker";
import TabButton from "@/components/TabButton";
import BarChart from "@/components/Charts/BarChart";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useTipoRefeicaoOptions } from "@/hooks/useTipoRefeicaoOptions/hook";
import dayjs, { Dayjs } from "dayjs";
import {
  ICardapioPlanejamentoResumo,
  ICardapioPlanejamentoRow,
  mapApiResumoCardapioPlanejamento,
  mapApiRowCardapioPlanejamento,
  mapApiPreviewCardapioPlanejamento,
} from "@/Interfaces/Reports/cardapioPlanejamento";

const tabs = [
  { label: "Visão Geral", icon: <TwistedArrowIcon height={24} /> },
  { label: "Gráficos", icon: <StatsIcon height={24} /> },
];

const STATUS_OPTIONS = [
  { label: "Todos os status", value: "" },
  { label: "Planejado", value: "planejado" },
  { label: "Confirmado", value: "confirmado" },
  { label: "Servido", value: "servido" },
];

interface FilterFields {
  dataInicio: Dayjs;
  dataFim: Dayjs;
  unidade: string;
  tipo: string;
  status: string;
}

async function fetchJson(url: string) {
  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message ?? `Erro ao carregar ${url}`);
  }
  return data;
}

export function ReportsTab({ }: ReportsTabProps) {
  const theme = useTheme();
  const { unitOptions } = useUnitFilterOptions();

  const [activeTab, setActiveTab] = React.useState(0);

  const { control } = useForm<FilterFields>({
    defaultValues: {
      dataInicio: dayjs().subtract(29, "day"),
      dataFim: dayjs(),
      unidade: "all",
      tipo: "",
      status: "",
    },
  });

  const filters = useWatch({ control });
  const { tipoRefeicaoOptions } = useTipoRefeicaoOptions(
    filters.unidade && filters.unidade !== "all" ? filters.unidade : undefined,
  );

  const [resumo, setResumo] = React.useState<ICardapioPlanejamentoResumo | null>(null);
  const [rows, setRows] = React.useState<ICardapioPlanejamentoRow[]>([]);
  const [chartData, setChartData] = React.useState<{ label: string; value: number }[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const dataInicio = filters.dataInicio as Dayjs | undefined;
    const dataFim = filters.dataFim as Dayjs | undefined;
    if (!dataInicio || !dataFim) return;

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          data_inicio: dataInicio.format("YYYY-MM-DD"),
          data_fim: dataFim.format("YYYY-MM-DD"),
        });
        if (filters.unidade && filters.unidade !== "all") params.set("unidade_id", filters.unidade);
        if (filters.tipo) params.set("tipo_refeicao_id", filters.tipo);
        if (filters.status) params.set("status", filters.status);

        const [resumoData, listarData, previewData] = await Promise.all([
          fetchJson(`/api/relatorio/cardapio-planejamento/resumo?${params}`),
          fetchJson(`/api/relatorio/cardapio-planejamento?${params}`),
          fetchJson(`/api/relatorio/cardapio-planejamento/preview?${params}`),
        ]);

        if (cancelled) return;
        setResumo(mapApiResumoCardapioPlanejamento(resumoData));
        setRows((Array.isArray(listarData) ? listarData : []).map(mapApiRowCardapioPlanejamento));
        setChartData(
          mapApiPreviewCardapioPlanejamento(previewData).map((p) => ({ label: p.label, value: p.valor })),
        );
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar relatório de cardápio");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [filters.dataInicio, filters.dataFim, filters.unidade, filters.tipo, filters.status]);

  return (
    <>
      <Stack direction={"row"} gap={2}>
        {tabs.map((tab, index) => (
          <TabButton
            key={index}
            label={tab.label}
            icon={tab.icon}
            tabIndex={index}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        ))}
      </Stack>

      <Card>
        <Stack gap={{ xs: 1, sm: 2 }} direction={"row"} flexWrap="wrap">
          <DatePicker label="Data Início" name="dataInicio" control={control} />
          <DatePicker label="Data Fim" name="dataFim" control={control} />

          <Select
            options={unitOptions}
            name="unidade"
            control={control}
            formControlSx={{ maxWidth: "250px" }}
          />

          <Select
            options={[{ label: "Todos os tipos", value: "" }, ...tipoRefeicaoOptions.filter((o) => o.value !== "")]}
            name="tipo"
            control={control}
            formControlSx={{ maxWidth: "250px" }}
          />

          <Select
            options={STATUS_OPTIONS}
            name="status"
            control={control}
            formControlSx={{ maxWidth: "250px" }}
          />
        </Stack>
      </Card>

      {error && <Alert severity="error">{error}</Alert>}

      {isLoading ? (
        <Stack alignItems="center" padding={4}>
          <CircularProgress />
        </Stack>
      ) : activeTab === 0 ? (
        <>
          <Box
            display="grid"
            gap={2}
            gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
          >
            <InfoCard
              key="total-cardapios"
              icon={<CalendarIcon color="#1447E6" />}
              bgColor="info.main"
              label="Total de Cardápios"
              value={resumo?.totalCardapios ?? 0}
            />
            <InfoCard
              key="refeicoes-previstas"
              icon={<RefeicoesIcon color="#00A63E" />}
              bgColor="success.main"
              label="Refeições Previstas"
              value={resumo?.totalRefeicoesPrevistas ?? 0}
            />
            <InfoCard
              key="refeicoes-realizadas"
              icon={<RefeicoesIcon color="#8200DB" />}
              bgColor="purple.main"
              label="Refeições Realizadas"
              value={resumo?.totalRefeicoesRealizadas ?? 0}
            />
            <InfoCard
              key="aderencia-media"
              icon={<PaperIcon color="#E17100" />}
              bgColor="warning.main"
              label="Aderência Média (%)"
              value={resumo?.aderenciaMedia ?? 0}
            />
          </Box>

          <Card>
            <Box>
              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <TwistedArrowIcon height={22} width={22} style={{ transform: "scaleY(-1)" }} color={theme.palette.primary.main} />
                <Typography>Planejado vs Realizado</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">Comparação de produção e consumo</Typography>
            </Box>

            <Table
              columns={reportsMenuColumns}
              rows={rows}
              initialRowsPerPage={5}
            />
          </Card>
        </>
      ) : (
        <Card>
          <Box>
            <Stack direction={"row"} alignItems={"center"} gap={1}>
              <StatsIcon height={22} width={22} style={{ transform: "scaleY(-1)" }} color={theme.palette.primary.main} />
              <Typography>Aderência por Dia</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Percentual de refeições realizadas em relação ao previsto
            </Typography>
          </Box>

          <BarChart
            labels={chartData.map((p) => p.label)}
            datasets={[
              { label: "Aderência (%)", data: chartData.map((p) => p.value), backgroundColor: "#3B82F6" },
            ]}
            title="Aderência por Dia"
          />
        </Card>
      )}
    </>
  );
}
