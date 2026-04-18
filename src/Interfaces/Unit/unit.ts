import { IPolicy } from "../Policy/policy";

export interface IUnit {
  id?: number;
  nome: string;
  endereco: string;
  responsavel: string;
  status: string;
  horarioAbertura?: string;
  horarioFechamento?: string;
  politicas: IPolicy;
}