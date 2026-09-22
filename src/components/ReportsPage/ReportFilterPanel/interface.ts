import React from "react";
import { ReportDateIssue } from "@/hooks/useReportFilters";

export interface ReportFilterPanelProps {
  /** Campos já montados, na ordem do desenho: escopo primeiro, datas no fim. */
  children: React.ReactNode;
  dateIssue?: ReportDateIssue | null;
  isLoading?: boolean;
  onApply: () => void;
}
