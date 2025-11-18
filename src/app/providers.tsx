"use client";

import MainLayout from "@/components/Layouts/Main";
import { Provider } from "@/components/ui/provider";
import { LanguageProvider } from "@/context/LanguageContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider>
      <LanguageProvider>
        <MainLayout>{children}</MainLayout>
      </LanguageProvider>
    </Provider>
  );
}
