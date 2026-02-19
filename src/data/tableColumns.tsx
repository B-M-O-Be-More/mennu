import { IColumn } from "@/components/Tables/Table";
import { IExtraRequest } from "@/Interfaces/ExtraRequest/extraRequestColumns";
import { IMovement } from "@/Interfaces/Movement/movement";
import { IStock } from "@/Interfaces/Stock/stock";
import { IUser } from "@/Interfaces/User/user";
import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import { PaperIcon } from "@/components/Icons";
import { MealRecordsResponse } from "@/Interfaces/Meals/MealTypes";
import { formatDateTime } from "@/utils/formatDateTime";

const userColumns: IColumn<IUser>[] = [
  {
    key: "nome",
    label: "Nome",
    render: (row) => (
      <Stack direction="row" alignItems="center">
        <Avatar
          sx={{
            bgcolor: "primary.main",
            mr: 1,
            width: 32,
            height: 32,
            fontSize: 14,
          }}>
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

const movementColumns: IColumn<IMovement>[] = [
  { key: "data", label: "Data" },
  {
    key: "tipo",
    label: "Tipo",
    render: (row) => {
      const colorMap: Record<
        IMovement["tipo"],
        "success" | "info" | "error" | "purple"
      > = {
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

const extraRequestColumns: IColumn<IExtraRequest>[] = [
  { key: "data", label: "Data" },
  {
    key: "user",
    label: "Nome",
    render: (row) => (
      <Stack direction="row" alignItems="center">
        <Avatar
          sx={{
            bgcolor: "primary.main",
            mr: 1,
            width: 32,
            height: 32,
            fontSize: 14,
          }}>
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
    key: "status",
    label: "Status",
    render: (row) => {
      const colorMap: Record<
        IExtraRequest["status"],
        "success" | "warning" | "error"
      > = {
        aprovado: "success",
        pendente: "warning",
        reprovado: "error",
      };

      return (
        <Chip
          label={row.status}
          color={colorMap[row.status]}
          size="small"
          sx={{ minWidth: "100px", textTransform: "capitalize" }}
        />
      );
    },
  },
  {
    key: "resposta",
    label: "Resposta",
    render: (row) =>
      row.resposta ? (
        <Stack>
          <Typography variant="caption" color="text.secondary">
            {" "}
            {row.resposta.data}{" "}
          </Typography>
          <Typography variant="caption">
            {" "}
            Por: {row.resposta.usuario}{" "}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {" "}
            Comentário: {row.resposta.comentario}{" "}
          </Typography>
        </Stack>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%">
          <Typography variant="body2" color="text.secondary">
            {" "}
            —{" "}
          </Typography>
        </Box>
      ),
  },
];

const mealRecordsColumns: IColumn<MealRecordsResponse>[] = [
  {
    key: "usuario",
    label: "Usuário",
    render: (row) => (
      <Stack direction={{ md: "row" }} alignItems="center" gap={0.5}>
        <Avatar
          sx={{
            bgcolor: "primary.main",
            mr: 1,
            width: 32,
            height: 32,
            fontSize: 14,
          }}>
          {row.usuario
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </Avatar>
        <Typography variant="body2">{row.usuario}</Typography>
        {row.isManual && (
          <Chip
            icon={<PaperIcon color="#8200DB" height={18} />}
            color="purple"
            label="Manual"
            sx={{ padding: "0.5rem" }}
          />
        )}
      </Stack>
    ),
  },
  { key: "matricula", label: "Matrícula" },
  { key: "tipo", label: "Tipo" },
  { key: "unidade", label: "Unidade" },
  {
    key: "horario",
    label: "Horário",
    render: (row) => formatDateTime(row.horario),
  },
  { key: "terminal", label: "Terminal" },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      const colorMap: Record<string, "success" | "warning" | "error"> = {
        Servida: "success",
        Pendente: "warning",
        Cancelada: "error",
      };
      return (
        <Chip
          label={row.status}
          color={colorMap[row.status]}
          size="small"
          sx={{ minWidth: "100px", textTransform: "capitalize" }}
        />
      );
    },
  },
];

export {
  userColumns,
  stockColumns,
  movementColumns,
  extraRequestColumns,
  mealRecordsColumns,
};
