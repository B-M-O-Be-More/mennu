import {
  AuditDecimal,
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
  if (normalized.includes("cancel")) return "cancelada";
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
  cancelada: { label: "Cancelada", color: "default" },
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

/** Número da auditoria em pt-BR, sem zeros à direita. */
function formatNumber(value: number): string {
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
}

/**
 * Quantidades vêm da API como string decimal ("371.00"). Converte para número
 * antes de qualquer conta ou formatação; devolve `null` para vazio/inválido.
 */
export function toAuditNumber(value: AuditDecimal | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;

  const parsed =
    typeof value === "number" ? value : Number(String(value).replace(",", "."));

  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Quantidade com unidade ("30 KG"). Item ainda não conferido vem `null` —
 * nesse caso mostra travessão em vez de "0".
 */
export function formatAuditQuantity(
  value: AuditDecimal | undefined,
  unidadeMedida?: string | null,
  options?: { signed?: boolean },
): string {
  const parsed = toAuditNumber(value);
  if (parsed === null) return "—";

  const unit = (unidadeMedida ?? "").toUpperCase();
  const signal = options?.signed && parsed > 0 ? "+" : "";
  const formatted = `${signal}${formatNumber(parsed)}`;

  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Tolerância do item. `tolerancia_tipo` não tem enum no schema: qualquer
 * variação de "percentual" vira `%`, o resto usa a unidade do insumo.
 */
export function formatAuditTolerance(item: {
  tolerancia_valor: AuditDecimal;
  tolerancia_tipo: string | null;
  unidade_medida?: string | null;
}): string {
  const valor = toAuditNumber(item.tolerancia_valor);
  if (valor === null) return "—";

  const tipo = String(item.tolerancia_tipo ?? "").toLowerCase();
  if (tipo.includes("perc") || tipo.includes("%")) {
    return `${formatNumber(valor)}%`;
  }

  return formatAuditQuantity(valor, item.unidade_medida);
}

/**
 * URL que o `<img>` usa para a foto da auditoria.
 *
 * O arquivo é servido por um endpoint autenticado da API, e a tag `<img>` não
 * manda `Authorization` nem os headers de tenant — apontar para o host da API
 * devolveria 401. O caminho relativo que a API entrega
 * ("/api/auditoria-estoque/4/fotos/1/arquivo") casa com a rota de proxy deste
 * app, que repassa a chamada já autenticada.
 */
export function resolveAuditPhotoUrl(url?: string | null): string {
  if (!url) return "";
  if (/^(https?:|data:|blob:)/i.test(url)) return url;

  return url.startsWith("/") ? url : `/${url}`;
}

/** Até onde a máscara aceita dígitos, antes de perder precisão no `Number`. */
const QUANTITY_MAX_DIGITS = 12;

/** Casas decimais da quantidade fracionada (kg, L, …). */
const QUANTITY_DECIMALS = 2;

/** Unidades contadas em peças — fracionar não faz sentido. */
const INTEGER_UNITS = ["un"];

/** A unidade do insumo é contada em peças ("un"), não em frações. */
export function isIntegerAuditUnit(unidadeMedida?: string | null): boolean {
  return INTEGER_UNITS.includes(String(unidadeMedida ?? "").trim().toLowerCase());
}

/**
 * Máscara da quantidade conferida: aceita só dígitos e reformata a cada tecla
 * — "1" vira "0.01" e "125" vira "1.25". Em unidade contada em peças o campo
 * fica inteiro ("125" continua "125"). O formato com ponto é o mesmo que a API
 * usa, então o valor digitado vai direto para o `Number` no envio.
 */
export function maskAuditQuantity(
  value: string,
  unidadeMedida?: string | null,
): string {
  const digits = value.replace(/\D/g, "").slice(0, QUANTITY_MAX_DIGITS);
  if (!digits) return "";

  // `Number` também derruba os zeros à esquerda de "007".
  if (isIntegerAuditUnit(unidadeMedida)) return String(Number(digits));

  return (Number(digits) / 10 ** QUANTITY_DECIMALS).toFixed(QUANTITY_DECIMALS);
}

/** Quantidade salva de volta no campo, no mesmo formato que a máscara produz. */
export function formatAuditQuantityInput(
  value: number,
  unidadeMedida?: string | null,
): string {
  return isIntegerAuditUnit(unidadeMedida)
    ? String(Math.round(value))
    : value.toFixed(QUANTITY_DECIMALS);
}
