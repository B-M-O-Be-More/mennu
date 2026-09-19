import React from "react";

export interface ReportSectionProps {
  /** Vira o id do heading — é o alvo do `aria-labelledby` da seção. */
  id: string;
  title: string;
  description?: string;
  /** Texto curto à direita do título (ex.: "128 registros"). */
  meta?: string;
  action?: React.ReactNode;
  /** Sem moldura de card — pra seções que já contêm cards dentro. */
  plain?: boolean;
  children: React.ReactNode;
}
