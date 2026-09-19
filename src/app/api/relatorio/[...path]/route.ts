import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";

/**
 * Proxy genérico pra tudo em `/relatorio/*` que ainda não tem rota própria
 * (acesso, auditoria, presença, terminais, usuários, consumo/desperdício,
 * gerencial). Next.js resolve rota estática antes de catch-all, então
 * `cardapio-planejamento` e `refeicoes-servidas` (com arquivos próprios)
 * continuam intocados — este arquivo só vê o resto.
 *
 * Repassa `listar`/`resumo`/`preview` (JSON) e `exportar` (csv/pdf, stream
 * binário) pelo mesmo handler: o branch é pelo `content-type` da resposta do
 * backend, não pelo path pedido.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const baseUrl = getApiBaseUrl();
  const headers = await getAuthHeaders();

  if (!headers) {
    return NextResponse.json({ message: "Autenticação necessária" }, { status: 401 });
  }

  const { path } = await params;
  const { searchParams } = new URL(req.url);
  const url = new URL(`${baseUrl}/relatorio/${path.join("/")}`);
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
        { message: text || "Erro ao processar relatório" },
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
