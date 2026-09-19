export interface ReportErrorStateProps {
  message: string;
  /** Sem isso o alerta vira beco sem saída — sempre passe o recarregamento. */
  onRetry?: () => void;
  isRetrying?: boolean;
  /** Ação secundária, ex.: voltar os filtros ao padrão. */
  secondaryAction?: { label: string; onClick: () => void };
}
