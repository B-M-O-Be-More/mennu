export function formatDate(date: Date, format: string): string {
  const dd = date.getDate().toString().padStart(2, "0");
  const MM = (date.getMonth() + 1).toString().padStart(2, "0");
  const yyyy = date.getFullYear().toString();
  const yy = yyyy.slice(-2);
  const hh = date.getHours().toString().padStart(2, "0");
  const mm = date.getMinutes().toString().padStart(2, "0");
  const ss = date.getSeconds().toString().padStart(2, "0");

  return format
    .replace("yyyy", yyyy)
    .replace("yy", yy)
    .replace("dd", dd)
    .replace("MM", MM)
    .replace("hh", hh)
    .replace("mm", mm)
    .replace("ss", ss);
}
