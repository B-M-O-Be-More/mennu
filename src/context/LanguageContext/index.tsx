"use client";

import React from "react";
import { LanguageContextProps } from "./interface";
import i18next from "@/i18n";
import { parseCookies, setCookie } from "nookies";

const LanguageContext = React.createContext<LanguageContextProps>({
  language: "pt",
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = React.useState<string>("pt");

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    i18next.changeLanguage(lang);

    setCookie(null, "@Readbox:language", lang, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  };

  React.useEffect(() => {
    const cookies = parseCookies();
    const savedLanguage = cookies["@Readbox:language"] || "pt";

    i18next.changeLanguage(savedLanguage);
    setLanguage(savedLanguage);
  }, []);
  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
