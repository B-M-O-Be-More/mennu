export interface IAuditoriaRow {
  id: number;
  auditoriaId: number;
  dataReferencia: string;
  unidade: string;
  auditor: string;
  status: string;
  insumo: string;
  unidadeMedida: string;
  quantidadeTeorica: number | null;
  quantidadeEncontrada: number | null;
  divergencia: number | null;
  divergente: boolean;
  observacao: string;
  normalizada: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiRowAuditoria(raw: any): IAuditoriaRow {
  return {
    id: raw.id,
    auditoriaId: raw.auditoria_id,
    dataReferencia: raw.data_referencia,
    unidade: raw.unidade ?? "—",
    auditor: raw.auditor ?? "—",
    status: raw.status ?? "—",
    insumo: raw.insumo ?? "—",
    unidadeMedida: raw.unidade_medida ?? "",
    quantidadeTeorica: raw.quantidade_teorica ?? null,
    quantidadeEncontrada: raw.quantidade_encontrada ?? null,
    divergencia: raw.divergencia ?? null,
    divergente: Boolean(raw.divergente),
    observacao: raw.observacao ?? "",
    normalizada: Boolean(raw.normalizada),
  };
}
