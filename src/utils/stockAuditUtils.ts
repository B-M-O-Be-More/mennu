import {
  IStockAudit,
  IStockAuditSummary,
  StockAuditStatusKey,
} from "@/Interfaces/StockAudit/stockAudit";

/**
 * Status da auditoria de estoque.
 *
 * O OpenAPI declara `status` como string livre, sem enum — então normalizamos
 * (sem acento, minúsculo, `_` no lugar de espaço/hífen) e reconhecemos as
 * variações conhecidas, caindo num rótulo neutro para qualquer valor novo.
 */
export function toStatusKey(status?: string | null): StockAuditStatusKey {
  const normalized = String(status ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (normalized.includes("rascunho") || normalized.includes("draft")) {
    return "rascunho";
  }
  if (normalized.includes("divergenc")) return "com_divergencia";
  if (normalized.includes("normaliz")) return "normalizada";
  if (normalized.includes("enviad")) return "enviada";

  return "desconhecido";
}

type ChipColor = "success" | "error" | "info" | "purple" | "default";

const STATUS_LABELS: Record<
  StockAuditStatusKey,
  { label: string; color: ChipColor }
> = {
  rascunho: { label: "Rascunho", color: "purple" },
  enviada: { label: "Enviado", color: "success" },
  com_divergencia: { label: "Com Divergência", color: "error" },
  normalizada: { label: "Normalizada", color: "info" },
  desconhecido: { label: "—", color: "default" },
};

/** Rótulo e cor do chip de status, com fallback para valores desconhecidos. */
export function resolveStatus(status?: string | null) {
  const key = toStatusKey(status);
  if (key !== "desconhecido") return { key, ...STATUS_LABELS[key] };

  const raw = String(status ?? "").trim();
  return {
    key,
    label: raw ? raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase() : "—",
    color: "default" as ChipColor,
  };
}

/** Auditoria ainda em rascunho: sem divergência apurada, ação é "Continuar". */
export function isDraft(audit: IStockAudit) {
  return toStatusKey(audit.status) === "rascunho";
}

/**
 * Totalizadores dos cards. Derivados da lista carregada — a API não expõe um
 * endpoint de resumo para esta tela, e `total` usa o `total_results` da
 * paginação quando disponível.
 */
export function summarizeAudits(
  audits: IStockAudit[],
  totalResults?: number,
): IStockAuditSummary {
  return audits.reduce<IStockAuditSummary>(
    (summary, audit) => {
      const key = toStatusKey(audit.status);

      if (key === "rascunho") summary.emAndamento += 1;
      if (key === "normalizada") summary.normalizadas += 1;
      if (key === "com_divergencia" || audit.total_divergentes > 0) {
        summary.comDivergencia += 1;
      }

      return summary;
    },
    {
      total: totalResults ?? audits.length,
      emAndamento: 0,
      comDivergencia: 0,
      normalizadas: 0,
    },
  );
}
