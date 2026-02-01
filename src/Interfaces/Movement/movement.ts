export interface IMovement {
  data: string;
  tipo: "entrada" | "saida" | "perda" | "ajuste";
  item: string;
  quantidade: number;
  responsavel: string;
  justificativa: string;
}
