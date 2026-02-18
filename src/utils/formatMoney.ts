export function safeNumber(value: string | number): number {
  const numberValue = parseFloat(String(value));
  return isNaN(numberValue) ? 0 : numberValue;
}

export function formatMoney(
  amount: number | string = 0,
  decimalDigits = 2,
  currencySymbol = true,
  onlyDecimals = false,
): string {
  const parsedAmount = safeNumber(amount);

  const formatted = new Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: decimalDigits,
  }).format(parsedAmount);

  if (onlyDecimals) {
    const [, decimal] = formatted.split(",");
    return decimal ? decimal.padEnd(decimalDigits, "0") : "00";
  }

  if (!currencySymbol) {
    return formatted.replace(/[^0-9.,]/g, "");
  }

  return formatted;
}
