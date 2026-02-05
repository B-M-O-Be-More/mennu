import dayjs from "dayjs";

export function formatTime(iso?: string | null) {
  if (!iso) return "";

  const parsed = dayjs(iso);
  return parsed.isValid() ? parsed.format("HH:mm") : "";
}


export function formatDateTime(iso?: string | null) {
  if (!iso) return "";

  const parsed = dayjs(iso);
  return parsed.isValid() ? parsed.format("DD/MM/YYYY HH:mm") : "";
}
