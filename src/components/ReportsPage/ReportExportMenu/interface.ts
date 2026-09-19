export interface ReportExportFormat {
  formato: "csv" | "pdf";
  label: string;
  href: string;
}

export interface ReportExportMenuProps {
  formats: ReportExportFormat[];
  disabled?: boolean;
  /** Rótulo do botão — default "Exportar". */
  label?: string;
  size?: "small" | "medium";
}
