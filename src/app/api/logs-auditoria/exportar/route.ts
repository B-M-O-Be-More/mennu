import { NextRequest, NextResponse } from "next/server";
import { getApiBaseUrl } from "@/app/api/_shared/getApiBaseUrl";
import { getAuthHeaders } from "@/app/api/_shared/getAuthHeaders";

export async function GET(req: NextRequest) {
  const baseUrl = getApiBaseUrl();
  const headers = await getAuthHeaders();

  if (!headers) {
    return NextResponse.json(
      { message: "Autenticação necessária" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const url = new URL(`${baseUrl}/logs-auditoria/exportar/`);

  searchParams.forEach((value, key) => {
    if (value !== "") url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      }

      const text = await response.text();
      return NextResponse.json(
        { message: text || "Erro ao exportar logs" },
        { status: response.status },
      );
    }

    const contentType = response.headers.get("content-type") ?? "text/csv";
    const contentDisposition =
      response.headers.get("content-disposition") ??
      'attachment; filename="logs-auditoria.csv"';

    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (err) {
    return NextResponse.json({ message: String(err) }, { status: 500 });
  }
}
