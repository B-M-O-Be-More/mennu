/** Converte o decimal da API para a convenção digitada em pt-BR. */
export function apiDecimalToInput(value: string | number | null | undefined) {
  return String(value ?? 0).replace(".", ",");
}

/** Normaliza vírgula ou ponto para o formato decimal aceito pela API. */
export function inputDecimalToApi(value: string) {
  return value.trim().replace(",", ".");
}
