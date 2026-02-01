import { IUnit } from "../Unit/unit";

export interface IExtraRequest {
  id: number;
  data: string;
  unidade: IUnit;
  tipo: string;
  usuario: {
    nome: string;
    matricula: string;
  };
  motivo: string;
  status: "aprovado" | "pendente" | "reprovado";
  resposta: {
    data: string;
    usuario: string;
    comentario: string;
  } | null;
}