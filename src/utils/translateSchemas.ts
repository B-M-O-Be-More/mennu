"use client";

import { useTranslations } from "next-intl";
import { ErrorOption } from "react-hook-form";
type TranslateFunction = ReturnType<typeof useTranslations>;

export const handleTranslateSchemas = (
  error: ErrorOption,
  t: TranslateFunction
) => {
  if (!error || !error.message) return;

  const number = error.message.match(/\d+/)?.[0];

  const translationKeyMap: Record<string, string> = {
    min: "min",
    max: "max",
    required: "required",
    email: "email",
    length: "length",
    fileSize: "fileSize",
    matches: "matches",
  };

  const translationKey = translationKeyMap[error.type || ""];
  if (!translationKey) return;

  return number ? t(translationKey, { number }) : t(translationKey);
};
