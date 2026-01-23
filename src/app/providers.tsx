"use client";

import { UserProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { theme } from "@/theme/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";


export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <UserProvider>
        <CssBaseline />
        {children}
        </UserProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
