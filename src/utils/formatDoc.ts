export function formatCpfCnpj(type: "cpf" | "cnpj", value: string): string {
  if (type === "cpf") {
    value = value.replace(/[^\d]/g, "");

    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  if (type === "cnpj") {
    return value.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5",
    );
  }

  return value;
}
