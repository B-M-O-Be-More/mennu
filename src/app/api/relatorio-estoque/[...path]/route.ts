import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";

/**
 * Proxy genérico pra `/relatorio-estoque/*` (hífen, sem `/relatorio/` na
 * frente — router hand-written, não faz parte do engine de `ReportSpec`).
 * Mesmo branch JSON/stream de `src/app/api/relatorio/[...path]/route.ts`.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const baseUrl = getApiBaseUrl();
  const headers = await getAuthHeaders();

  if (!headers) {
    return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });
  }

  const { path } = await params;
  const { searchParams } = new URL(req.url);
  const url = new URL(`${baseUrl}/relatorio-estoque/${path.join("/")}`);
  searchParams.forEach((value, key) => {
    if (value !== "") url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url.toString(), { headers });
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const data = await response.json().catch(() => ({ message: "Resposta inválida da API" }));
      return NextResponse.json(data, { status: response.status });
    }

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { message: text || "Erro ao processar relatório de estoque" },
        { status: response.status },
      );
    }

    const contentDisposition = response.headers.get("content-disposition") ?? "attachment";
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (err) {
    return NextResponse.json({ message: String(err) }, { status: 500 });
  }
}
