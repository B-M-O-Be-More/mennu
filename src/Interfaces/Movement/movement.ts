export type MovementTipo =
  | "entrada"
  | "saida"
  | "perda"
  | "inventario"
  | "transferencia_saida"
  | "transferencia_entrada";

export interface IMovement {
  id: number;
  data: string;
  tipo: MovementTipo;
  item: string;
  quantidade: number;
  responsavel: string;
  justificativa: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiMovement(raw: any): IMovement {
  return {
    id: raw.id,
    data: raw.data,
    tipo: raw.tipo,
    item: raw.insumo_nome ?? "",
    quantidade: Number(raw.quantidade ?? 0),
    responsavel: raw.criado_por_nome ?? "—",
    justificativa: raw.justificativa || raw.motivo || "",
  };
}
