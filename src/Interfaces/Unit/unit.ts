import { IPolicy } from "../Policy/policy";

export interface IUnit {
  nome: string;
  endereco: string;
  responsavel: string;
  status: string;
  politicas: IPolicy
}