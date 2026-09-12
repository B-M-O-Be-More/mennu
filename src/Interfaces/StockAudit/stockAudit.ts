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
  | "cancelada"
  | "desconhecido";

/** Item do checklist — `GET /auditoria-estoque/{id}/checklist/`. */
export interface IStockAuditChecklistItem {
  id: number;
  insumo_id: number;
  insumo_nome: string;
  unidade_medida: string;
  quantidade_encontrada: AuditDecimal;
  observacao: string;
  conferido: boolean;
  total_fotos: number;
}

/** Checklist da auditoria, com os totalizadores usados no resumo. */
export interface IStockAuditChecklist {
  id: number;
  unidade_id: number;
  unidade_nome: string | null;
  /** Nome do auditor responsável — só o checklist devolve esse campo. */
  auditor_resp: string | null;
  status: string;
  data_referencia: string;
  observacao_geral: string | null;
  total_itens: number;
  itens_pendentes: number;
  editavel: boolean;
  itens_conferidos: number;
  qtd_fotos: number;
  itens_divergentes: number;
  itens: IStockAuditChecklistItem[];
}

/**
 * Decimal da auditoria. A API serializa quantidades como string ("371.00"),
 * então todo consumo passa por `toAuditNumber` antes de calcular ou formatar.
 */
export type AuditDecimal = number | string | null;

/** Item do detalhe — `GET /auditoria-estoque/{id}`, já com teórico e tolerância. */
export interface IStockAuditDetailItem {
  id: number;
  insumo_id: number;
  insumo_nome: string;
  unidade_medida: string;
  quantidade_teorica: AuditDecimal;
  quantidade_encontrada: AuditDecimal;
  divergencia: AuditDecimal;
  tolerancia_valor: AuditDecimal;
  tolerancia_tipo: string | null;
  divergente: boolean;
  observacao: string;
  ajuste_movimentacao_id: number | null;
  total_fotos: number;
}

/** Auditoria completa — `GET /auditoria-estoque/{id}/`. */
export interface IStockAuditDetail {
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
  periodo_inicio: string | null;
  periodo_fim: string | null;
  observacao_geral: string | null;
  motivo_normalizacao: string | null;
  normalizada_por_id: number | null;
  tolerancia_snapshot: Record<string, unknown>;
  editavel: boolean;
  itens: IStockAuditDetailItem[];
}

/** Foto anexada à auditoria — `GET /auditoria-estoque/{id}/fotos`. */
export interface IStockAuditPhoto {
  id: number;
  auditoria_id: number;
  item_id: number | null;
  ordem: number;
  tamanho_bytes: number;
  mime_type: string;
  criado_em: string;
  url: string;
}
