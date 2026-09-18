import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";

/**
 * Streaming da foto da auditoria.
 *
 * A API serve o arquivo por um endpoint autenticado, e uma tag `<img>` não
 * manda `Authorization` nem os headers de tenant — por isso o binário passa
 * por aqui. O caminho é o mesmo que a API devolve em `foto.url`
 * ("/api/auditoria-estoque/{id}/fotos/{fotoId}/arquivo"), então o `src` pode
 * apontar direto para esta rota.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; fotoId: string }> },
) {
  const baseUrl = getApiBaseUrl();
  const authHeaders = await getAuthHeaders();
  if (!authHeaders) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const { id, fotoId } = await params;

  // Nada de JSON aqui: a resposta é binária.
  const headers: Record<string, string> = { ...authHeaders, Accept: "*/*" };
  delete headers["Content-Type"];

  try {
    const response = await fetch(
      `${baseUrl}/auditoria-estoque/${id}/fotos/${fotoId}/arquivo`,
      { headers },
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: `Erro ao carregar a foto (${response.status})` },
        { status: response.status },
      );
    }

    const contentType =
      response.headers.get("content-type") ?? "application/octet-stream";

    return new NextResponse(await response.arrayBuffer(), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Privado: a foto é do tenant da sessão, não pode cair em cache
        // compartilhado.
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (err) {
    return NextResponse.json({ message: String(err) }, { status: 500 });
  }
}
