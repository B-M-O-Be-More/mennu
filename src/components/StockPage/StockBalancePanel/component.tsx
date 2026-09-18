import { Alert, Box, FormControlLabel, Stack, Switch, Typography } from "@mui/material";
import React from "react";
import Card from "@/components/Cards/Card";
import Table from "@/components/Tables/Table";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { useForm, useWatch, useController } from "react-hook-form";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useDebounce } from "@/hooks/useDebounce/hook";
import { saldoEstoqueColumns, saldoEstoqueConsolidadoColumns } from "@/data/tableColumns";
import {
  ISaldoEstoqueItem,
  ISaldoEstoqueConsolidado,
  mapApiSaldoEstoqueItem,
  mapApiSaldoEstoqueConsolidado,
} from "@/Interfaces/Stock/saldoEstoque";
import { StockBalancePanelProps } from "./interface";

interface FilterFields {
  unidadeId: string;
  lote: string;
  comSaldo: boolean;
}

export default function StockBalancePanel({ refreshToken = 0 }: StockBalancePanelProps) {
  const { unitOptions } = useUnitFilterOptions();
  const { control, register } = useForm<FilterFields>({
    defaultValues: { unidadeId: "all", lote: "", comSaldo: true },
  });
  const { field: comSaldoField } = useController({ name: "comSaldo", control });

  const filters = useWatch({ control });
  const debouncedLote = useDebounce(filters.lote, 500);

  const [items, setItems] = React.useState<ISaldoEstoqueItem[]>([]);
  const [consolidado, setConsolidado] = React.useState<ISaldoEstoqueConsolidado[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters.unidadeId && filters.unidadeId !== "all") {
          params.set("unidade_id", filters.unidadeId);
        }
        if (debouncedLote) params.set("lote", debouncedLote);
        params.set("com_saldo", String(filters.comSaldo ?? true));
        params.set("page_size", "200");

        const allResults: ISaldoEstoqueItem[] = [];
        let page = 1;
        let totalPages = 1;

        do {
          const pageParams = new URLSearchParams(params);
          pageParams.set("page", String(page));
          const response = await fetch(`/api/saldo-estoque?${pageParams}`);
          const payload = await response.json();
          if (!response.ok) {
            throw new Error(payload.message || "Erro ao carregar saldo de estoque");
          }
          const results = Array.isArray(payload.results) ? payload.results : [];
          allResults.push(...results.map(mapApiSaldoEstoqueItem));
          totalPages = payload.metadados?.total_pages ?? 1;
          page += 1;
        } while (page <= totalPages);

        let consolidadoResults: ISaldoEstoqueConsolidado[] = [];
        if (filters.unidadeId && filters.unidadeId !== "all") {
          const response = await fetch(`/api/saldo-estoque/unidade/${filters.unidadeId}`);
          const payload = await response.json();
          if (!response.ok) {
            throw new Error(payload.message || "Erro ao carregar resumo da unidade");
          }
          consolidadoResults = (Array.isArray(payload) ? payload : []).map(mapApiSaldoEstoqueConsolidado);
        }

        if (cancelled) return;
        setItems(allResults);
        setConsolidado(consolidadoResults);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erro ao carregar saldo de estoque");
        setItems([]);
        setConsolidado([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [filters.unidadeId, debouncedLote, filters.comSaldo, refreshToken]);

  return (
    <Card>
      {error && <Alert severity="error">{error}</Alert>}

      <Stack direction="row" gap={2} flexWrap="wrap" alignItems="flex-end">
        <Select
          label="Unidade"
          options={unitOptions}
          name="unidadeId"
          control={control}
          formControlSx={{ minWidth: "220px" }}
        />
        <Input label="Lote" placeholder="Ex: L2026-001" register={register("lote")} />
        <FormControlLabel
          control={
            <Switch
              checked={!!comSaldoField.value}
              onChange={(e) => comSaldoField.onChange(e.target.checked)}
            />
          }
          label="Somente com saldo"
        />
      </Stack>

      {filters.unidadeId && filters.unidadeId !== "all" && consolidado.length > 0 && (
        <Box>
          <Typography variant="body1" marginBottom={1}>Resumo por Insumo</Typography>
          <Table columns={saldoEstoqueConsolidadoColumns} rows={consolidado} initialRowsPerPage={5} />
        </Box>
      )}

      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography>Saldo por Lote</Typography>
          {!isLoading && (
            <Typography variant="body2" color="text.secondary">
              {items.length} registros
            </Typography>
          )}
        </Stack>
        <Table columns={saldoEstoqueColumns} rows={items} initialRowsPerPage={10} isLoading={isLoading} />
      </Box>
    </Card>
  );
}
