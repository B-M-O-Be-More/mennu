"use client";

import Card from "@/components/Cards/Card";
import Input from "@/components/FormControl/Input";
import { FilterIcon, SearchIcon } from "@/components/Icons";
import Table from "@/components/Tables/Table";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import React from "react";
import { ConsumptionTabProps } from "./";
import { consumptionHistoryColumns } from "@/data/tableColumns";
import Select from "@/components/FormControl/Select";
import { IConsumptionHistory } from "@/Interfaces/Menu/menu";
import { useDebounce } from "@/hooks/useDebounce/hook";

interface ApiConsumptionRecord {
  id?: number;
  usuario_id?: number;
  usuario_nome?: string;
  usuario?: { id?: number; nome?: string; matricula?: string };
  matricula?: string;
  tipo_refeicao_nome?: string;
  tipo?: string;
  unidade_nome?: string;
  unidade?: { nome?: string };
  data_hora?: string;
  horario?: string;
  manual?: boolean;
  is_manual?: boolean;
  status?: string;
}

interface ApiUnit {
  id?: number;
  nome?: string;
}

interface ApiMealType {
  id?: number;
  nome?: string;
}

type ConsumptionRow = IConsumptionHistory & {
  unidade: string;
  tipoRefeicao: string;
};

function normalizeArrayPayload<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];

  if (payload && typeof payload === "object") {
    const root = payload as { results?: unknown; data?: unknown };

    if (Array.isArray(root.results)) return root.results as T[];

    if (root.data && typeof root.data === "object") {
      const data = root.data as { results?: unknown };
      if (Array.isArray(data.results)) return data.results as T[];
    }
  }

  return [];
}

function mapApiRecordToConsumptionRow(record: ApiConsumptionRecord, index: number): ConsumptionRow {
  const normalizedStatus = String(record.status ?? "").toLowerCase();
  const status: IConsumptionHistory["status"] =
    normalizedStatus === "liberado" || normalizedStatus === "servida"
      ? "liberado"
      : "bloqueado";

  const isManual = Boolean(record.manual ?? record.is_manual);
  const dateTime = record.data_hora ?? record.horario ?? new Date().toISOString();
  const mealType = record.tipo_refeicao_nome ?? record.tipo ?? "-";

  return {
    id: record.id ?? index + 1,
    user: {
      id: record.usuario?.id ?? record.usuario_id ?? 0,
      nome: record.usuario_nome ?? record.usuario?.nome ?? "Usuário",
      matricula: record.matricula ?? record.usuario?.matricula ?? "-",
    },
    data: dateTime,
    horario: dateTime,
    refeicao: {
      id: record.id ?? index + 1,
      categoria: mealType as IConsumptionHistory["refeicao"]["categoria"],
      nome: mealType,
      descricao: mealType,
      restricoes: [],
      status: "ativo",
    },
    status,
    tipo: isManual ? "manual" : "automático",
    unidade: record.unidade_nome ?? record.unidade?.nome ?? "-",
    tipoRefeicao: mealType,
  };
}

export function ConsumptionTab({ }: ConsumptionTabProps) {
  const [records, setRecords] = React.useState<ConsumptionRow[]>([]);
  const [unitOptions, setUnitOptions] = React.useState<{ label: string; value: string }[]>([
    { label: "Todas as unidades", value: "all" },
  ]);
  const [mealTypeOptions, setMealTypeOptions] = React.useState<
    { label: string; value: string }[]
  >([{ label: "Todos os tipos", value: "all" }]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    control,
    watch,
  } = useForm<{ menuSearch: string; unidade: string; tipos: string }>({
    defaultValues: {
      menuSearch: "",
      unidade: "all",
      tipos: "all",
    },
  });

  const filters = watch();
  const debouncedSearch = useDebounce(filters.menuSearch ?? "", 400);

  React.useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        const [recordsResponse, unitsResponse, mealTypesResponse] = await Promise.all([
          fetch("/api/refeicao"),
          fetch("/api/unidades"),
          fetch("/api/tipo-refeicao"),
        ]);

        if (!recordsResponse.ok) {
          const errData = await recordsResponse
            .json()
            .catch(() => ({ message: "Erro ao carregar consumo" }));
          throw new Error(errData.message ?? "Erro ao carregar consumo");
        }

        if (!unitsResponse.ok) {
          const errData = await unitsResponse
            .json()
            .catch(() => ({ message: "Erro ao carregar unidades" }));
          throw new Error(errData.message ?? "Erro ao carregar unidades");
        }

        if (!mealTypesResponse.ok) {
          const errData = await mealTypesResponse
            .json()
            .catch(() => ({ message: "Erro ao carregar tipos de refeição" }));
          throw new Error(errData.message ?? "Erro ao carregar tipos de refeição");
        }

        const [recordsPayload, unitsPayload, mealTypesPayload] = await Promise.all([
          recordsResponse.json(),
          unitsResponse.json(),
          mealTypesResponse.json(),
        ]);

        const mappedRecords = normalizeArrayPayload<ApiConsumptionRecord>(recordsPayload).map(
          mapApiRecordToConsumptionRow,
        );
        setRecords(mappedRecords);

        const unitsFromApi = normalizeArrayPayload<ApiUnit>(unitsPayload)
          .map((unit) => ({
            label: unit.nome ?? "Unidade",
            value: String(unit.id ?? unit.nome ?? ""),
          }))
          .filter((opt) => opt.value);

        const unitsFromRecords = Array.from(new Set(mappedRecords.map((record) => record.unidade)))
          .filter(Boolean)
          .map((unit) => ({ label: unit, value: unit }));

        setUnitOptions([
          { label: "Todas as unidades", value: "all" },
          ...unitsFromApi,
          ...unitsFromRecords.filter(
            (recordOpt) => !unitsFromApi.some((apiOpt) => apiOpt.label === recordOpt.label),
          ),
        ]);

        const mealTypesFromApi = normalizeArrayPayload<ApiMealType>(mealTypesPayload)
          .map((mealType) => ({
            label: mealType.nome ?? "Tipo",
            value: String(mealType.id ?? mealType.nome ?? ""),
          }))
          .filter((opt) => opt.value);

        const mealTypesFromRecords = Array.from(
          new Set(mappedRecords.map((record) => record.tipoRefeicao)),
        )
          .filter(Boolean)
          .map((mealType) => ({ label: mealType, value: mealType }));

        setMealTypeOptions([
          { label: "Todos os tipos", value: "all" },
          ...mealTypesFromApi,
          ...mealTypesFromRecords.filter(
            (recordOpt) => !mealTypesFromApi.some((apiOpt) => apiOpt.label === recordOpt.label),
          ),
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido ao carregar consumo");
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredRecords = React.useMemo(() => {
    const search = debouncedSearch.trim().toLowerCase();

    return records.filter((row) => {
      const searchMatches =
        !search ||
        row.user.nome.toLowerCase().includes(search) ||
        row.user.matricula.toLowerCase().includes(search);

      const selectedUnit = filters.unidade;
      const unitMatches =
        !selectedUnit ||
        selectedUnit === "all" ||
        row.unidade === selectedUnit ||
        row.unidade === unitOptions.find((opt) => opt.value === selectedUnit)?.label;

      const selectedType = filters.tipos;
      const mealTypeMatches =
        !selectedType ||
        selectedType === "all" ||
        row.tipoRefeicao === selectedType ||
        row.tipoRefeicao === mealTypeOptions.find((opt) => opt.value === selectedType)?.label;

      return searchMatches && unitMatches && mealTypeMatches;
    });
  }, [debouncedSearch, filters.tipos, filters.unidade, mealTypeOptions, records, unitOptions]);

  const totalLiberado = React.useMemo(
    () => filteredRecords.filter((record) => record.status === "liberado").length,
    [filteredRecords],
  );

  return (
    <>
      <Stack
        gap={0}
        padding={{ xs: 1, md: 3 }}
        spacing={2}
        border="1px solid"
        borderColor="divider"
        borderRadius={2}
        bgcolor="background.paper"
      >
        {error && <Alert severity="error">{error}</Alert>}

        <Stack gap={{ xs: 1, sm: 2 }} direction={"row"}>
          <Input
            placeholder="Buscar por nome, matrícula..."
            icon={<SearchIcon />}
            register={register("menuSearch")}
          />
          <Select
            options={unitOptions}
            name="unidade"
            control={control}
            formControlSx={{ maxWidth: "250px" }}
          />

          <Select
            options={mealTypeOptions}
            name="tipos"
            control={control}
            formControlSx={{ maxWidth: "250px" }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{ fontWeight: "400", minWidth: "120px" }}
            type="button"
            onClick={() => { }}
          >
            Filtrar
          </Button>
        </Stack>


        <Card>
          <Box>
            <Typography>Histórico de Consumo</Typography>
            <Typography variant="body2" color="text.secondary">
              Total de {totalLiberado} refeições liberadas
            </Typography>
          </Box>

          <Table
            columns={consumptionHistoryColumns}
            rows={filteredRecords}
            initialRowsPerPage={5}
            isLoading={isLoading}
          />

        </Card>

      </Stack >
    </>
  );
}
