"use client";

import React from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Modal from "../Modal";
import Select from "@/components/FormControl/Select";
import DatePicker from "@/components/FormControl/DatePicker";
import TextArea from "@/components/FormControl/TextArea";
import { SelectOption } from "@/components/FormControl/Select/interface";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { createStockAuditSchema } from "@/schemas/stockAuditSchema";
import { NewStockAuditModalProps } from "./interface";

type FormData = {
  unidade_id: string;
  auditor_id: string;
  data_visita: Dayjs | null;
  observacao_geral?: string;
};

type ApiItem = { id?: number | string | null; nome?: string | null };

const UNIT_PROMPT: SelectOption = {
  label: "Selecione uma Unidade",
  value: "",
};
const AUDITOR_PROMPT: SelectOption = { label: "Selecione o Auditor", value: "" };

/** A API ora devolve `results` na raiz, ora dentro de `data` — ou o array puro. */
function normalizeResults<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];

  if (payload && typeof payload === "object") {
    const root = payload as { results?: unknown; data?: unknown };
    if (Array.isArray(root.results)) return root.results as T[];

    if (root.data && typeof root.data === "object") {
      const data = root.data as { results?: unknown };
      if (Array.isArray(data.results)) return data.results as T[];
    }
    if (Array.isArray(root.data)) return root.data as T[];
  }

  return [];
}

/** Mesma tolerância do `useUnitFilterOptions`: cai para o nome quando não vem id. */
function toOptions(items: ApiItem[]): SelectOption[] {
  return items
    .map((item) => ({
      label: item.nome ?? `#${item.id}`,
      value: String(item.id ?? item.nome ?? ""),
    }))
    .filter((option) => option.value);
}

async function fetchJson(url: string, fallbackError: string) {
  const response = await fetch(url);

  if (!response.ok) {
    const errData = await response
      .json()
      .catch(() => ({ message: fallbackError }));
    throw new Error(errData.message ?? errData.detail ?? fallbackError);
  }

  return response.json();
}

export default function NewStockAuditModal({
  open,
  onClose,
  onCreated,
}: NewStockAuditModalProps) {
  // Reaproveita o mesmo carregamento de unidades das outras telas.
  const { unitOptions: loadedUnits, unitsError } = useUnitFilterOptions();

  const [auditorOptions, setAuditorOptions] = React.useState<SelectOption[]>([
    AUDITOR_PROMPT,
  ]);
  const [auditorsError, setAuditorsError] = React.useState<string | null>(null);
  const [checklistCount, setChecklistCount] = React.useState<number | null>(
    null,
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const unitOptions = React.useMemo<SelectOption[]>(
    () => [UNIT_PROMPT, ...loadedUnits.filter((option) => option.value !== "all")],
    [loadedUnits],
  );

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(
      createStockAuditSchema,
    ) as unknown as Resolver<FormData>,
    defaultValues: {
      unidade_id: "",
      auditor_id: "",
      data_visita: null,
      observacao_geral: "",
    },
  });

  const unidadeId = watch("unidade_id");

  // Carregamento próprio: uma falha aqui não pode esvaziar o select de unidades.
  React.useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const loadAuditors = async () => {
      try {
        const payload = await fetchJson(
          "/api/usuarios?cargo=auditor&page_size=200",
          "Erro ao carregar auditores",
        );

        if (cancelled) return;

        setAuditorOptions([
          AUDITOR_PROMPT,
          ...toOptions(normalizeResults<ApiItem>(payload)),
        ]);
        setAuditorsError(null);
      } catch (err) {
        if (cancelled) return;
        setAuditorOptions([AUDITOR_PROMPT]);
        setAuditorsError(
          err instanceof Error ? err.message : "Erro ao carregar auditores",
        );
      }
    };

    loadAuditors();

    return () => {
      cancelled = true;
    };
  }, [open]);

  // O checklist é montado a partir dos insumos da unidade — contamos com
  // `page_size=1` e lemos apenas o total da paginação.
  React.useEffect(() => {
    if (!open || !unidadeId) {
      setChecklistCount(null);
      return;
    }

    let cancelled = false;

    const loadChecklistCount = async () => {
      try {
        const payload = await fetchJson(
          `/api/insumo?unidade_id=${unidadeId}&page_size=1`,
          "Erro ao contar os itens do checklist",
        );

        if (cancelled) return;

        const total = (payload as { metadados?: { total_results?: number } })
          ?.metadados?.total_results;
        setChecklistCount(total ?? normalizeResults(payload).length);
      } catch {
        if (!cancelled) setChecklistCount(null);
      }
    };

    loadChecklistCount();

    return () => {
      cancelled = true;
    };
  }, [open, unidadeId]);

  const handleClose = () => {
    reset();
    setChecklistCount(null);
    setError(null);
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    setError(null);

    try {
      const unidade = Number(data.unidade_id);
      const auditor = Number(data.auditor_id);

      const response = await fetch("/api/auditoria-estoque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Os ids só entram quando numéricos; sem eles a API resolve a
          // unidade pelo escopo do usuário, conforme o schema de criação.
          ...(Number.isFinite(unidade) ? { unidade_id: unidade } : {}),
          ...(Number.isFinite(auditor) ? { auditor_id: auditor } : {}),
          data_visita: dayjs(data.data_visita).format("YYYY-MM-DD"),
          observacao_geral: data.observacao_geral?.trim() || null,
        }),
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao criar a auditoria" }));
        throw new Error(
          errData.message ?? errData.detail ?? "Erro ao criar a auditoria",
        );
      }

      onCreated?.();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar a auditoria");
    } finally {
      setIsSaving(false);
    }
  };

  const loadError = error ?? unitsError ?? auditorsError;

  return (
    <Modal open={open} onClose={handleClose} title="Nova Auditoria">
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} gap={3}>
        {loadError && <Alert severity="error">{loadError}</Alert>}

        <Select
          label="Selecione a Unidade"
          optional={false}
          options={unitOptions}
          name="unidade_id"
          control={control}
          error={errors.unidade_id?.message}
        />

        <Box
          display="grid"
          gap={3}
          gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)" }}
        >
          <Select
            label="Auditor Responsável"
            optional={false}
            options={auditorOptions}
            name="auditor_id"
            control={control}
            error={errors.auditor_id?.message}
          />

          <Box>
            <DatePicker
              label="Data da Visita"
              name="data_visita"
              control={control}
            />
            {errors.data_visita?.message && (
              <Typography variant="caption" color="error.contrastText">
                {errors.data_visita.message}
              </Typography>
            )}
          </Box>
        </Box>

        <TextArea
          label="Observações"
          placeholder="Observação sobre a auditoria..."
          rows={4}
          register={register("observacao_geral")}
          error={errors.observacao_geral?.message}
        />

        <Typography variant="body2" color="text.label">
          Itens do Checklist: {checklistCount ?? "—"}
        </Typography>

        <Stack
          direction="row"
          gap={2}
          borderTop="1px solid"
          borderColor="divider"
          paddingTop={2}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isSaving}
            sx={{ flex: 1, height: 56, fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving}
            sx={{ flex: 1, height: 56, fontWeight: 600 }}
          >
            {isSaving ? "Criando..." : "Criar Auditoria"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
