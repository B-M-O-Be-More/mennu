export const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function normalizeTime(value?: string) {
  if (!value) return value;

  const parts = value.split(":");
  let hours = parts[0] ?? "0";
  let minutes = parts[1] ?? "0";

  hours = hours.padStart(2, "0");
  minutes = minutes.padStart(2, "0");

  return `${hours}:${minutes}`;
}
