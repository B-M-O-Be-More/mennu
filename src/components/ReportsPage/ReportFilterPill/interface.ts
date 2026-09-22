import React from "react";
import { Dayjs } from "dayjs";

export interface ReportPillOption {
  label: string;
  value: string;
}

export interface ReportPillSelectProps {
  value: string;
  options: ReportPillOption[];
  onChange: (value: string) => void;
  /** "Tipo" vira "Tipo: Todos". Sem prefixo, a pílula mostra só o valor. */
  prefix?: string;
  /** Ícone de 12px à esquerda — só unidade e período têm, como na faixa. */
  icon?: React.ReactNode;
  /** Nome do filtro para leitores de tela: a pílula não tem rótulo visível. */
  ariaLabel: string;
}

export interface ReportPillDateProps {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  ariaLabel: string;
}
