import { NextResponse } from "next/server";

/** Normaliza respostas upstream, inclusive erros HTML e respostas vazias. */
export async function proxyResponse(response: Response): Promise<NextResponse> {
  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return NextResponse.json(await response.json(), { status: response.status });
  }

  const text = await response.text();
  return NextResponse.json(
    { message: text || "Resposta inesperada da API" },
    { status: response.status },
  );
}

export function proxyError(error: unknown): NextResponse {
  const message = error instanceof Error ? error.message : "Erro ao comunicar com a API";
  return NextResponse.json({ message }, { status: 500 });
}
