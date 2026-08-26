import { AccessCriteria } from "@/Interfaces/ProfilePermissions/profilePermissions";

export interface CanProps extends AccessCriteria {
  /** Conteúdo liberado somente com todas as permissões exigidas. */
  children?: React.ReactNode;
  /** Sem acesso: renderiza um Alert informativo com esta mensagem. */
  message?: string;
  /** Sem acesso: renderiza este nó (tem prioridade sobre `message`). */
  fallback?: React.ReactNode;
  /** Enquanto a sessão é validada (padrão: nada). */
  loadingFallback?: React.ReactNode;
}
