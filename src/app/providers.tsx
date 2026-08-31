"use client";

import { IUser } from "@/Interfaces/User/user";
import { UserProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { theme } from "@/theme/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";

export function Providers({
  children,
  initialUser,
  initialUnidadeId,
}: {
  children: ReactNode;
  initialUser?: IUser | null;
  /** Unidade ativa lida do cookie no servidor — ver `UserProviderProps`. */
  initialUnidadeId?: number | null;
}) {
  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <UserProvider initialUser={initialUser} initialUnidadeId={initialUnidadeId}>
        <CssBaseline />
        {children}
        </UserProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
