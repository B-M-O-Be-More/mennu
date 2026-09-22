import React from "react";
import { Dayjs } from "dayjs";

export interface ReportAppliedFilterPill {
  key: string;
  label: string;
  /** Ícone de 12px à esquerda do rótulo — só período e unidade têm. */
  icon?: React.ReactNode;
}

export interface ReportAppliedFiltersProps {
  pills: ReportAppliedFilterPill[];
  /** Quando os números na tela terminaram de carregar. */
  generatedAt?: Dayjs | null;
}
