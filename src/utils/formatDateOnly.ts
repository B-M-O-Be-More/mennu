import dayjs from "dayjs";

export function formatDateOnly(date?: string | null, format = "DD/MM/YYYY") {
  if (!date) return "";

  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format(format) : "";
}
