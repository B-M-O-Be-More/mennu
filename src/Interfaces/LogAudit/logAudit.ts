export interface ILogAuditListItem {
  id: number;
  criado_em: string;
  usuario_email: string;
  acao: string;
  modulo: string;
  ip_address?: string | null;
  status: string;
}

export interface ILogAuditStats {
  total_eventos: number;
  total_sucessos: number;
  total_erros: number;
  total_avisos: number;
}

export interface ILogAuditDetail extends ILogAuditListItem {
  detalhes?: Record<string, unknown>;
  is_critico?: boolean;
  unidade_id?: number | null;
  usuario_id?: number | null;
  user_agent?: string | null;
}

export interface IPaginationMetadados {
  count: number;
  next?: string | null;
  previous?: string | null;
  page: number;
  total_pages: number;
  total_results: number;
}

export interface ILogAuditResponse {
  message?: string;
  metadados: IPaginationMetadados;
  results: ILogAuditListItem[];
}

export interface ILogAuditFilters {
  search: string;
  modulo: string;
  status: string;
}
