import { IUserContext } from "@/Interfaces/User/context";

export const CONTEXT_EMPRESA_HEADER = "x-mennu-context-empresa-id";
export const CONTEXT_UNIDADE_HEADER = "x-mennu-context-unidade-id";

export type ApiRequestContext = Pick<IUserContext, "empresa_id" | "unidade_id">;

/** Contexto temporário entre o client e os proxies; não altera a unidade da sessão. */
export function getContextRequestHeaders(
  context?: ApiRequestContext | null,
): Record<string, string> {
  if (!context) return {};

  return {
    [CONTEXT_EMPRESA_HEADER]: String(context.empresa_id),
    [CONTEXT_UNIDADE_HEADER]: String(context.unidade_id),
  };
}

function parsePositiveId(value: string | null): number | null {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function readContextRequestHeaders(headers: Headers): ApiRequestContext | null {
  const empresaId = parsePositiveId(headers.get(CONTEXT_EMPRESA_HEADER));
  const unidadeId = parsePositiveId(headers.get(CONTEXT_UNIDADE_HEADER));
  if (empresaId === null || unidadeId === null) return null;

  return { empresa_id: empresaId, unidade_id: unidadeId };
}
