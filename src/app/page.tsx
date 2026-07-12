"use client";

import FormLogin from "@/components/Forms/FormLogin";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormLogin />
    </Suspense>
  );
}
