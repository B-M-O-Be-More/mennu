"use client";

import Card from "@/components/Cards/Card";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { FilterIcon, SearchIcon } from "@/components/Icons";
import InfoCard from "@/components/Cards/InfoCard";
import Table from "@/components/Tables/Table";
import { mealRecordsColumns } from "@/data/tableColumns";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { mealInfoCards } from "@/data/meals";
import { useForm, useWatch } from "react-hook-form";
import { MealRecordsTabProps, SearchFields } from "./interface";
import { MealRecordsResponse } from "@/Interfaces/Meals/MealTypes";
import React from "react";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useDebounce } from "@/hooks/useDebounce/hook";

interface ApiMealRecord {
  nome: string | undefined;
  usuario_matricula: string | undefined;
  id?: number;
  usuario_id?: number;
  usuario_nome?: string;
  usuario?: { nome?: string; matricula?: string };
  matricula?: string;
  cardapio_id?: number;
  tipo_refeicao_nome?: string;
  tipo?: string;
  unidade_nome?: string;
  unidade?: { nome?: string };
  data_hora?: string;
  horario?: string;
  terminal_nome?: string;
  terminal?: { nome?: string };
  manual?: boolean;
  is_manual?: boolean;
  status?: string;
}

const statusOptions = [
  { label: "Todos os status", value: "all" },
  { label: "Servida", value: "Servida" },
  { label: "Pendente", value: "Pendente" },
  { label: "Cancelada", value: "Cancelada" },
];

function normalizeRecords(payload: unknown): ApiMealRecord[] {
  if (Array.isArray(payload)) return payload as ApiMealRecord[];

  if (payload && typeof payload === "object") {
    const root = payload as { results?: unknown; data?: unknown };

    if (Array.isArray(root.results)) return root.results as ApiMealRecord[];

    if (root.data && typeof root.data === "object") {
      const data = root.data as { results?: unknown };
      if (Array.isArray(data.results)) return data.results as ApiMealRecord[];
    }
  }

  return [];
}

function mapApiRecordToUi(record: ApiMealRecord): MealRecordsResponse {
  const isManual = Boolean(record.manual ?? record.is_manual);
  const fallbackUserId = record.usuario_id ? `#${record.usuario_id}` : "";

  const status = (record.status ?? "Servida") as MealRecordsResponse["status"];

  return {
    isManual,
    usuario:
      record.nome ||
      record.usuario_nome ||
      record.usuario?.nome ||
      `Usuário ${fallbackUserId}`,
    matricula:
      record.usuario_matricula ||
      record.matricula ||
      record.usuario?.matricula ||
      "-",
    tipo:
      record.tipo_refeicao_nome ??
      record.tipo ??
      (record.cardapio_id ? `Cardápio #${record.cardapio_id}` : "-"),
    unidade: record.unidade_nome ?? record.unidade?.nome ?? "-",
    horario: record.data_hora ?? record.horario ?? new Date().toISOString(),
    terminal: record.terminal_nome ?? record.terminal?.nome ?? (isManual ? "Manual" : "Terminal"),
    status: ["Servida", "Pendente", "Cancelada"].includes(status)
      ? status
      : "Servida",
  };
}

async function extractErrorMessage(response: Response, fallback: string) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const errData = await response.json().catch(() => ({} as { message?: string }));
    return errData.message ?? `${fallback} (HTTP ${response.status})`;
  }

  const text = await response.text().catch(() => "");
  const compactText = text.replace(/\s+/g, " ").trim();
  const preview = compactText ? `: ${compactText.slice(0, 180)}` : "";
  return `${fallback} (HTTP ${response.status})${preview}`;
}

export function MealRecordsTab({ refreshKey = 0 }: MealRecordsTabProps) {
  const { unitOptions, isLoadingUnits, unitsError } = useUnitFilterOptions();

  const { register, control } = useForm<SearchFields>({
    defaultValues: {
      userSearch: "",
      status: "all",
      unit: "all",
    },
  });

  const [records, setRecords] = React.useState<MealRecordsResponse[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadRecords = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/refeicao");

      if (!response.ok) {
        const message = await extractErrorMessage(
          response,
          "Erro ao carregar registros de refeição",
        );
        throw new Error(message);
      }

      const payload = await response.json();
      const mapped = normalizeRecords(payload).map(mapApiRecordToUi);
      setRecords(mapped);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao carregar registros de refeição",
      );
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadRecords();
  }, [loadRecords, refreshKey]);

  const filters = useWatch({ control });
  const debouncedSearch = useDebounce(filters.userSearch ?? "", 400);

  const unitFilterOptions = React.useMemo(() => {
    if (isLoadingUnits) {
      return [
        { label: "Todas as unidades", value: "all" },
        { label: "Carregando unidades...", value: "__loading_units__", disabled: true },
      ];
    }

    if (unitsError) {
      return [
        { label: "Todas as unidades", value: "all" },
        { label: "Erro ao carregar unidades", value: "__units_error__", disabled: true },
      ];
    }

    return unitOptions;
  }, [isLoadingUnits, unitOptions, unitsError]);

  const filteredRecords = React.useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    return records.filter((row) => {
      const statusMatches =
        !filters.status || filters.status === "all" || row.status === filters.status;
      const selectedUnit = filters.unit;
      const unitMatches =
        !selectedUnit ||
        selectedUnit === "all" ||
        row.unidade === selectedUnit ||
        row.unidade === unitFilterOptions.find((option) => option.value === selectedUnit)?.label;
      const searchMatches =
        !normalizedSearch ||
        row.usuario.toLowerCase().includes(normalizedSearch) ||
        row.matricula.toLowerCase().includes(normalizedSearch);

      return statusMatches && unitMatches && searchMatches;
    });
  }, [debouncedSearch, filters.status, filters.unit, records, unitFilterOptions]);

  const summaryCards = React.useMemo(() => {
    const served = filteredRecords.filter((row) => row.status === "Servida").length;
    const pending = filteredRecords.filter((row) => row.status === "Pendente").length;
    const canceled = filteredRecords.filter((row) => row.status === "Cancelada").length;

    return mealInfoCards.map((card) => {
      if (card.key === "served") return { ...card, value: served };
      if (card.key === "pending") return { ...card, value: pending };
      if (card.key === "cancelled") return { ...card, value: canceled };
      return card;
    });
  }, [filteredRecords]);

  return (
    <Card>
      {error && <Alert severity="error">{error}</Alert>}

      <Stack direction={"row"} gap={2}>
        <Input
          placeholder="Buscar por nome, matrícula..."
          icon={<SearchIcon />}
          register={register("userSearch")}
        />

        <Select
          options={unitFilterOptions}
          formControlSx={{ maxWidth: "18%" }}
          register={register("unit")}
        />
        <Select
          options={statusOptions}
          formControlSx={{ maxWidth: "18%" }}
          register={register("status")}
        />

        <Button
          type="button"
          variant="outlined"
          startIcon={<FilterIcon />}
          sx={{ width: "15%" }}>
          Filtrar
        </Button>
      </Stack>

      {!isLoading && filteredRecords.length === 0 && !error && (
        <Typography color="text.secondary">Nenhum registro encontrado para os filtros selecionados.</Typography>
      )}

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns="repeat(auto-fit, minmax(240px, 1fr))">
        {summaryCards.map((card) => (
          <InfoCard
            key={card.key}
            icon={card.icon}
            bgColor={card.bgColor}
            label={card.label}
            value={card.value}
          />
        ))}
      </Box>

      <Table columns={mealRecordsColumns} rows={filteredRecords} isLoading={isLoading} />
    </Card>
  );
}
