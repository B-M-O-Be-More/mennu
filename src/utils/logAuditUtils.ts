import { ILogAuditDetail } from "@/Interfaces/LogAudit/logAudit";
import { formatDateTime } from "./formatDateTime";

export type LogAuditStatusKey = "sucesso" | "erro" | "aviso" | "default";

export type LogAuditDetailField = {
  label: string;
  value: string;
  fullWidth?: boolean;
};

export function normalizeLogAuditStatus(status?: string | null): LogAuditStatusKey {
  const normalized = String(status ?? "").trim().toLowerCase();

  if (normalized.includes("sucesso")) return "sucesso";
  if (normalized.includes("erro") || normalized.includes("falha")) return "erro";
  if (normalized.includes("aviso") || normalized.includes("warn")) return "aviso";

  return "default";
}

export function formatLogAuditDateTime(value?: string | null) {
  return formatDateTime(value, "DD/MM/YYYY HH:mm:ss") || "-";
}

export function formatLogAuditDetailValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function pickLogAuditDetailValue(
  details: Record<string, unknown> | undefined,
  keys: string[],
) {
  if (!details) return undefined;

  for (const [entryKey, entryValue] of Object.entries(details)) {
    if (keys.includes(entryKey.toLowerCase())) return entryValue;
  }

  return undefined;
}

export function getLogAuditDetailFields(log: ILogAuditDetail): LogAuditDetailField[] {
  const details = log.detalhes;
  const profile =
    pickLogAuditDetailValue(details, ["perfil", "cargo", "role", "papel"]) ?? "-";
  const responseTime =
    pickLogAuditDetailValue(details, [
      "tempo_resposta",
      "tempo_resposta_ms",
      "response_time",
      "response_time_ms",
      "latencia",
      "latency_ms",
    ]) ?? "-";
  const userAgent =
    log.user_agent ??
    pickLogAuditDetailValue(details, ["user_agent", "useragent", "agent", "browser"]) ??
    "-";

  return [
    { label: "Timestamp", value: formatLogAuditDateTime(log.criado_em) },
    { label: "Usuário", value: log.usuario_email || "-" },
    { label: "Perfil", value: formatLogAuditDetailValue(profile) },
    { label: "Módulo", value: log.modulo || "-" },
    { label: "Endereço IP", value: log.ip_address || "-" },
    { label: "Tempo de Resposta", value: formatLogAuditDetailValue(responseTime) },
    { label: "User Agent", value: formatLogAuditDetailValue(userAgent), fullWidth: true },
  ];
}

export function getLogAuditDetailMessage(log: ILogAuditDetail) {
  const explicitMessage = pickLogAuditDetailValue(log.detalhes, [
    "mensagem",
    "message",
    "descricao",
    "description",
    "detalhe",
    "detail",
  ]);

  if (explicitMessage) return formatLogAuditDetailValue(explicitMessage);

  switch (normalizeLogAuditStatus(log.status)) {
    case "sucesso":
      return "Ação concluída com sucesso no sistema.";
    case "erro":
      return "A operação registrou falha e precisa de análise.";
    case "aviso":
      return "A operação foi concluída com atenção ou comportamento inesperado.";
    default:
      return "Evento registrado no sistema.";
  }
}
