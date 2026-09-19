import React from "react";
import { ReportDateIssue } from "@/hooks/useReportFilters";

export interface ReportFilterChip {
  key: string;
  label: string;
  /** Quando presente, o chip ganha "x" e some sozinho do recorte aplicado. */
  onRemove?: () => void;
}

/** Bloco de campos com legenda própria — é o que dá leitura semântica ao filtro. */
export interface ReportFilterGroup {
  id: string;
  titulo: string;
  /** Linha de largura cheia entre a legenda e os campos — hoje só os atalhos de período. */
  extra?: React.ReactNode;
  children: React.ReactNode;
}

export interface ReportFilterBarProps {
  groups: ReportFilterGroup[];
  chips?: ReportFilterChip[];
  dirty: boolean;
  /** Habilita "Limpar tudo" — falso quando o recorte já é o padrão. */
  canClear: boolean;
  canUndo?: boolean;
  dateIssue?: ReportDateIssue | null;
  isLoading?: boolean;
  onApply: () => void;
  onDiscard: () => void;
  onClear: () => void;
  onUndo?: () => void;
}
