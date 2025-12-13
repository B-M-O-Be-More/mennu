"use client";

import React from "react";
import { LanguageContextProps } from "./interface";
import i18next from "@/i18n";
// Lightweight cookie helpers to avoid nookies dependency
const setCookie = (name: string, value: string, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  const secure = window.location.protocol === "https:" ? ";Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};${expires};path=/;SameSite=Lax${secure}`;
};

const getCookie = (name: string): string | undefined => {
  const nameEQ = encodeURIComponent(name) + "=";
  const ca = document.cookie.split(";");
  for (let c of ca) {
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return undefined;
};

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
    setCookie("@Mennu:language", lang, 365);
  };

  React.useEffect(() => {
    const savedLanguage = getCookie("@Mennu:language") || "pt";

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
