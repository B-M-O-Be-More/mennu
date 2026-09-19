"use client";

import React from "react";

export interface OptionalColumnDef {
  key: string;
  label: string;
  /** Maioria começa oculta — a tabela padrão fica enxuta; quem quer o campo extra liga. */
  defaultVisible?: boolean;
}

function readStored(storageKey: string): string[] | null {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : null;
  } catch {
    return null;
  }
}

function writeStored(storageKey: string, keys: string[]) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(keys));
  } catch {
    // localStorage indisponível (aba privada, storage bloqueado) — perde só a lembrança entre sessões.
  }
}

/**
 * Quais colunas "extras" (fora da tabela padrão) o usuário ligou pra este
 * relatório — é a personalização da informação mostrada. Fica salvo por
 * navegador (não sincroniza entre dispositivos, não é dado de servidor).
 */
export function useReportColumnVisibility(storageKey: string, definitions: OptionalColumnDef[]) {
  const defaultKeys = React.useMemo(
    () => definitions.filter((d) => d.defaultVisible).map((d) => d.key),
    [definitions],
  );

  const [visibleKeys, setVisibleKeys] = React.useState<string[]>(() => {
    if (typeof window === "undefined") return defaultKeys;
    return readStored(storageKey) ?? defaultKeys;
  });

  const isVisible = React.useCallback((key: string) => visibleKeys.includes(key), [visibleKeys]);

  const toggle = React.useCallback(
    (key: string) => {
      setVisibleKeys((current) => {
        const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
        writeStored(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  return { definitions, visibleKeys, isVisible, toggle };
}

export type UseReportColumnVisibility = ReturnType<typeof useReportColumnVisibility>;
