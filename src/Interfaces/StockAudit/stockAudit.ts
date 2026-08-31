/**
 * Auditoria de estoque — `GET /auditoria-estoque/`.
 * Campos conforme o `AuditoriaEstoqueListSchema` do OpenAPI da API.
 */
export interface IStockAudit {
  id: number;
  unidade_id: number;
  unidade_nome: string | null;
  auditor_id: number | null;
  auditor_nome: string | null;
  status: string;
  data_referencia: string;
  total_itens: number;
  total_divergentes: number;
  enviada_em: string | null;
  normalizada_em: string | null;
  criado_em: string;
}

export interface IStockAuditMetadados {
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
  total_pages: number;
  total_results: number;
}

export interface IStockAuditResponse {
  message: string;
  metadados?: IStockAuditMetadados;
  results?: IStockAudit[];
}

/** Filtros aceitos pela API (os nomes seguem o schema `AuditoriaEstoqueFilterSchema`). */
export interface IStockAuditQuery {
  unidade_id?: number;
  auditor_id?: number;
  status?: string;
  data_inicio?: string;
  data_fim?: string;
  com_divergencia?: boolean;
  page?: number;
  page_size?: number;
}

/** Totalizadores dos cards, derivados da lista carregada. */
export interface IStockAuditSummary {
  total: number;
  emAndamento: number;
  comDivergencia: number;
  normalizadas: number;
}

/** Chave interna de status — a API devolve string livre, sem enum no schema. */
export type StockAuditStatusKey =
  | "rascunho"
  | "enviada"
  | "com_divergencia"
  | "normalizada"
  | "desconhecido";
