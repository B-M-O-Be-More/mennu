import React from "react";

export interface ReportEmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: "text" | "outlined" | "contained";
}

export interface ReportEmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  /** Caminhos de volta: limpar filtros, ampliar período, recarregar. */
  actions?: ReportEmptyStateAction[];
}
