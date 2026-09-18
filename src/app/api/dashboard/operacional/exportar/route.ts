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

  try {
    const response = await fetch(`${baseUrl}/dashboard/operacional/exportar`, { headers });

    if (!response.ok) {
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
      }

      const text = await response.text();
      return NextResponse.json(
        { message: text || "Erro ao exportar dashboard" },
        { status: response.status },
      );
    }

    const contentType = response.headers.get("content-type") ?? "application/pdf";
    const contentDisposition =
      response.headers.get("content-disposition") ??
      'attachment; filename="dashboard-operacional.pdf"';

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
