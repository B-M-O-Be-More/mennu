"use client";

import React from "react";
import { useForm, useWatch } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReportFilterValues = Record<string, any>;

/** Período inválido detectado no rascunho + a ação de um clique que conserta. */
export interface ReportDateIssue {
  message: string;
  actionLabel: string;
  onFix: () => void;
}

function serialize(values: ReportFilterValues) {
  return JSON.stringify(values);
}

function isDayjsLike(value: unknown): value is Dayjs {
  return Boolean(value) && typeof value === "object" && dayjs.isDayjs(value);
}

/** Datas não sobrevivem a `JSON.stringify` puro — grava como marcador + ISO, revive como `Dayjs` de volta. */
function persistFilters(storageKey: string, values: ReportFilterValues) {
  try {
    const serializable: Record<string, unknown> = {};
    Object.entries(values).forEach(([key, value]) => {
      serializable[key] = isDayjsLike(value) ? { __dayjs: value.format("YYYY-MM-DD") } : value;
    });
    window.localStorage.setItem(storageKey, JSON.stringify(serializable));
  } catch {
    // localStorage indisponível — só perde a lembrança entre sessões, filtro em memória continua funcionando.
  }
}

function readPersistedFilters(storageKey: string, fallback: ReportFilterValues): ReportFilterValues | null {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const revived: ReportFilterValues = { ...fallback };
    Object.keys(fallback).forEach((key) => {
      const value = parsed[key];
      if (value && typeof value === "object" && "__dayjs" in value) {
        const revivedDate = dayjs((value as { __dayjs: string }).__dayjs);
        if (revivedDate.isValid()) revived[key] = revivedDate;
        return;
      }
      if (key in parsed) revived[key] = value;
    });
    return revived;
  } catch {
    return null;
  }
}

/**
 * Estado de filtros de relatório com caminho de volta em cada passo:
 * `discard` desfaz o rascunho, `undo` volta pro conjunto aplicado
 * anterior, `clearAll` volta pro padrão (nunca pro que veio do
 * localStorage — "limpar" tem que limpar de verdade) e `dateIssue`
 * entrega o conserto pronto quando o usuário inverte as datas.
 *
 * Só existe um "aplicado" por vez — as telas disparam fetch em cima de
 * `applied`, nunca do rascunho, então errar um filtro não custa request.
 *
 * Com `storageKey`, o último recorte aplicado sobrevive à navegação —
 * voltar num relatório não obriga a refiltrar do zero.
 */
export function useReportFilters(
  defaultValues: ReportFilterValues,
  options: { dateRange?: boolean; storageKey?: string } = {},
) {
  const { storageKey } = options;

  const initialValues = React.useMemo(() => {
    if (!storageKey || typeof window === "undefined") return defaultValues;
    return readPersistedFilters(storageKey, defaultValues) ?? defaultValues;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const { control, reset } = useForm<ReportFilterValues>({ defaultValues: initialValues });
  const draft = useWatch({ control }) as ReportFilterValues;

  const [applied, setApplied] = React.useState<ReportFilterValues>(initialValues);
  const [previous, setPrevious] = React.useState<ReportFilterValues | null>(null);

  const dirty = serialize(draft) !== serialize(applied);
  const isDefault = serialize(applied) === serialize(defaultValues);

  /** Aplica um conjunto novo guardando o anterior pro "Desfazer". */
  const applyValues = React.useCallback(
    (next: ReportFilterValues) => {
      setPrevious(applied);
      setApplied(next);
      reset(next);
      if (storageKey) persistFilters(storageKey, next);
    },
    [applied, reset, storageKey],
  );

  const apply = React.useCallback(() => applyValues(draft), [applyValues, draft]);

  /** Joga o rascunho fora e volta pro que está aplicado na tela. */
  const discard = React.useCallback(() => reset(applied), [applied, reset]);

  const clearAll = React.useCallback(() => applyValues(defaultValues), [applyValues, defaultValues]);

  const undo = React.useCallback(() => {
    if (!previous) return;
    const target = previous;
    setPrevious(null);
    setApplied(target);
    reset(target);
    if (storageKey) persistFilters(storageKey, target);
  }, [previous, reset, storageKey]);

  /** Tira um filtro só (usado pelo "x" dos chips) devolvendo ele ao padrão. */
  const clearField = React.useCallback(
    (field: string) => applyValues({ ...applied, [field]: defaultValues[field] }),
    [applied, applyValues, defaultValues],
  );

  /** Saída do estado vazio: mesmo recorte, período maior. */
  const expandPeriod = React.useCallback(
    (days: number) =>
      applyValues({ ...applied, data_inicio: dayjs().subtract(days - 1, "day"), data_fim: dayjs() }),
    [applied, applyValues],
  );

  const dataInicio = draft.data_inicio as Dayjs | undefined;
  const dataFim = draft.data_fim as Dayjs | undefined;
  const invertedRange = Boolean(options.dateRange && dataInicio && dataFim && dataFim.isBefore(dataInicio, "day"));

  const dateIssue: ReportDateIssue | null = invertedRange
    ? {
        message: "A data fim é anterior à data início — o período não retorna nada assim.",
        actionLabel: "Inverter datas",
        onFix: () => reset({ ...draft, data_inicio: dataFim, data_fim: dataInicio }),
      }
    : null;

  return {
    control,
    draft,
    applied,
    dirty,
    isDefault,
    dateIssue,
    canUndo: previous !== null,
    apply,
    discard,
    clearAll,
    clearField,
    applyValues,
    expandPeriod,
    undo,
  };
}
