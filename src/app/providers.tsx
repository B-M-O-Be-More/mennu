"use client";

import { IUser } from "@/Interfaces/User/user";
import { UserProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { theme } from "@/theme/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";

export function Providers({ 
  children, 
  initialUser 
}: { 
  children: ReactNode;
  initialUser?: IUser | null;
}) {
  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <UserProvider initialUser={initialUser}>
        <CssBaseline />
        {children}
        </UserProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
