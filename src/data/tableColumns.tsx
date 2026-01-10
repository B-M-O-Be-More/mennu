import { IColumn } from "@/components/Tables/Table";

interface usersData {
  name: string;
  matricula: string;
  unidade: string;
  status: string;
  tipoAcesso: string;
  ultimaRefeicao: string;
  acoes: string;
}

const userColumns: IColumn<usersData>[] = [
  { key: "name", label: "Nome" },
  { key: "matricula", label: "Matrícula" },
  { key: "unidade", label: "Unidade", align: "right" },
  { key: "status", label: "Status" },
  { key: "tipoAcesso", label: "Tipo de Acesso" },
  { key: "ultimaRefeicao", label: "Última Refeição" },
];
export { userColumns };