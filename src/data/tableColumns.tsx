import { IColumn } from "@/components/Tables/Table";
import { IUser } from "@/Interfaces/User/user";
import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";

const userColumns: IColumn<IUser>[] = [
  {
    key: "nome",
    label: "Nome",
    render: (row) => (
      <Stack direction="row" alignItems="center">
        <Avatar sx={{ bgcolor: "primary.main", mr: 1, width: 32, height: 32, fontSize: 14 }}>
          {row.nome.split(" ").map((n) => n[0]).join("")}
        </Avatar>
        <Typography variant="body2">{row.nome}</Typography>
      </Stack>
    ),
  },
  { key: "matricula", label: "Matrícula" },
  { key: "unidade", label: "Unidade", align: "right" },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Chip
        label={row.status}
        color={row.status === true ? "success" : "default"}
        size="small"
        sx={{ minWidth: "100px" }}
      />
    ),
  },
  { key: "tipo_usuario", label: "Tipo de Acesso" },
  { key: "ultima_refeicao", label: "Última Refeição" },
  {
    key: "acoes",
    label: "Ações",
    render: () => (<></>),
  },
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

const stockColumns: IColumn<IStock>[] = [
  { key: "item", label: "Item" },
  { key: "categoria", label: "Categoria" },
  { key: "saldo", label: "Saldo", align: "right" },
  { key: "estoqueMinimo", label: "Estoque Mínimo" },
  { key: "unidade", label: "Unidade" },
  {
    key: "status", label: "Status",
    render: (row) => (
      <Chip
        label={row.status ? "Ativo" : "Inativo"}
        color={row.status ? "success" : "default"}
        size="small"
      />
    ),
  },
  {
    key: "acoes", label: "Ações",
    render: () => (<></>)
  },
];

interface IMovement {
  data: string;
  tipo: "entrada" | "saida" | "perda" | "ajuste";
  item: string;
  quantidade: number;
  responsavel: string;
  justificativa: string;
}

const movementColumns: IColumn<IMovement>[] = [
  { key: "data", label: "Data" },
  {
    key: "tipo",
    label: "Tipo",
    render: (row) => {
      const colorMap: Record<IMovement["tipo"], "success" | "info" | "error" | "purple"> = {
        entrada: "success",
        saida: "info",
        perda: "error",
        ajuste: "purple",
      };

      return (
        <Chip
          label={row.tipo}
          color={colorMap[row.tipo]}
          size="small"
          sx={{ minWidth: "100px" }}
        />
      );
    },
  },
  { key: "item", label: "Item" },
  { key: "quantidade", label: "Quantidade", align: "right" },
  { key: "responsavel", label: "Responsável" },
  { key: "justificativa", label: "Justificativa" },
];

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

interface ITerminal {
  id: string;
  nome: string;
  codigo: string;
  unidade: string;
  tipo: string;
  status: "online" | "offline" | "desatualizado";
  ultimaSync?: string;
  refeicoesPermitidas: string[];
  categoriasPermitidas: string[];
  ativo: boolean;
}

interface IExtraRequest {
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

const extraRequestColumns: IColumn<IExtraRequest>[] = [
  { key: "data", label: "Data" },
  {
    key: "user",
    label: "Nome",
    render: (row) => (
      <Stack direction="row" alignItems="center">
        <Avatar
          sx={{ bgcolor: "primary.main", mr: 1, width: 32, height: 32, fontSize: 14 }}
        >
          {row.usuario.nome
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </Avatar>
        <Typography variant="body2">{row.usuario.nome}</Typography>
      </Stack>
    ),
  },
  { key: "tipo", label: "Tipo" },
  { key: "motivo", label: "Motivo" },
  {
    key: "status", label: "Status",
    render: (row) => {
      const colorMap: Record<IExtraRequest["status"], "success" | "warning" | "error"> = {
        aprovado: "success",
        pendente: "warning",
        reprovado: "error",
      };

      return (
        <Chip
          label={row.status}
          color={colorMap[row.status]}
          size="small"
          sx={{ minWidth: "100px", textTransform: "capitalize" }} />);
    },
  },
  {
    key: "resposta", label: "Resposta",
    render: (row) =>
      row.resposta ? (
        <Stack>
          <Typography variant="caption" color="text.secondary"> {row.resposta.data} </Typography>
          <Typography variant="caption"> Por: {row.resposta.usuario} </Typography>
          <Typography variant="caption" color="text.secondary"> Comentário: {row.resposta.comentario} </Typography>
        </Stack>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Typography variant="body2" color="text.secondary"> — </Typography>
        </Box>
      ),
  }
];

export { userColumns, stockColumns, movementColumns, extraRequestColumns };
export type { IUser, IStock, IMovement, IUnit, IPolicy, ITerminal, IExtraRequest };