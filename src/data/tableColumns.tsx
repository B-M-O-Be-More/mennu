import ActionCell from "@/components/ActionCell";
import { IColumn } from "@/components/Tables/Table";
import { Avatar, Stack, Typography } from "@mui/material";

interface usersData {
  nome: string;
  matricula: string;
  unidade: string;
  status: string;
  categoria: string;
  ultimaRefeicao: string;
  acoes: React.ReactNode;
}

const userColumns: IColumn<usersData>[] = [
  {
    key: "nome",
    label: "Nome",
    render: (row) => (
      <Stack direction="row" alignItems="center">
        <Avatar
          sx={{ bgcolor: "primary.main", mr: 1, width: 32, height: 32, fontSize: 14 }}
        >
          {row.nome
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </Avatar>
        <Typography variant="body2">{row.nome}</Typography>
      </Stack>
    ),
  },
  { key: "matricula", label: "Matrícula" },
  { key: "unidade", label: "Unidade", align: "right" },
  { key: "status", label: "Status" },
  { key: "categoria", label: "Tipo de Acesso" },
  { key: "ultimaRefeicao", label: "Última Refeição" },
  {
    key: "acoes",
    label: "Ações",
    render: (row) => (
      <ActionCell
        checked={true}
        onToggle={(newState) => {
          console.log("Switch:", newState);
          console.log("Row clicada:", row);
        }}
        onEdit={() => {
          console.log("Editar row:", row);
        }}
      />
    ),
  },
];

interface IUser {
  nome: string;
  CPF: string;
  matricula: string;
  categoria: string;
  unidade: string;
  status: string;
  numeroCartao: string;
}

interface stockData {
  item: React.ReactNode;
  categoria: string;
  saldo: string;
  estoqueMinimo: string;
  unidade: string;
  status: React.ReactNode;
  acoes: React.ReactNode;
  unidadeMedida?: string;
}

const stockColumns: IColumn<stockData>[] = [
  { key: "item", label: "Item" },
  { key: "categoria", label: "Categoria" },
  { key: "saldo", label: "Saldo", align: "right" },
  { key: "estoqueMinimo", label: "Estoque Mínimo" },
  { key: "unidade", label: "Unidade" },
  { key: "status", label: "Status" },
  { key: "acoes", label: "Ações" },
];

interface IStock {
  item: string;
  categoria: string;
  saldo: string;
  estoqueMinimo: string;
  unidade: string;
  status: boolean;
  unidadeMedida: string;
}

interface movementData {
  data: string;
  tipo: React.ReactNode;
  item: string;
  quantidade: number;
  responsavel: string;
  justificativa: string;
}

const movementColumns: IColumn<movementData>[] = [
  { key: "data", label: "Data" },
  { key: "tipo", label: "Tipo" },
  { key: "item", label: "Item" },
  { key: "quantidade", label: "Quantidade", align: "right" },
  { key: "responsavel", label: "Responsável" },
  { key: "justificativa", label: "Justificativa" },
];

interface IMovement {
  data: string;
  tipo: string;
  item: string;
  quantidade: number;
  responsavel: string;
  justificativa: string;
}

interface IPolicy {
  horarios: {
    cafeManha: {
      inicio: string;
      fim: string;
    };
    almoco: {
      inicio: string;
      fim: string;
    };
    jantar: {
      inicio: string;
      fim: string;
    };
  }
  limites: {
    diario: number;
    semanal: number;
    mensal: number;
  };
}

interface IUnit {
  nome: string;
  endereco: string;
  responsavel: string;
  status: string;
  politicas: IPolicy
}

export { userColumns, stockColumns, movementColumns };
export type { IUser, usersData, IStock, IMovement, IUnit, IPolicy };