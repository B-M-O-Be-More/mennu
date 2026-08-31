import { IUserContext } from "@/Interfaces/User/context";

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface SelectUnitPageProps {}

export interface UnitOptionProps {
  contexto: IUserContext;
  selected: boolean;
  onSelect: (contexto: IUserContext) => void;
}
