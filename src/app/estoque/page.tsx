"use client";

import { Suspense } from "react";
import StockComponent from "@/components/StockPage";

export default function StockPage() {
  // `useSearchParams` exige um boundary de Suspense para o Next conseguir
  // pré-renderizar a rota.
  return (
    <Suspense fallback={null}>
      <StockComponent />
    </Suspense>
  );
}
