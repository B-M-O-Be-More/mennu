const GENERIC_MESSAGES = ["ok", "success", "sucesso"];

/**
 * Extrai a mensagem retornada pela API (`message` ou `detail`), ignorando
 * respostas genéricas como "Ok" que não dizem nada ao usuário.
 */
export function getApiMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const data = payload as { message?: unknown; detail?: unknown };
    const raw = typeof data.message === "string" ? data.message : data.detail;

    if (typeof raw === "string") {
      const message = raw.trim();
      if (message && !GENERIC_MESSAGES.includes(message.toLowerCase())) {
        return message;
      }
    }
  }

  return fallback;
}
