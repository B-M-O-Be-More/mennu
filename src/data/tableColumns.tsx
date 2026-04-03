import { IColumn } from "@/components/Tables/Table";
import { IExtraRequest } from "@/Interfaces/ExtraRequest/extraRequestColumns";
import { IMovement } from "@/Interfaces/Movement/movement";
import { IStock } from "@/Interfaces/Stock/stock";
import { IUser } from "@/Interfaces/User/user";
import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import { CheckIcon, PaperIcon, XIcon } from "@/components/Icons";
import { MealRecordsResponse } from "@/Interfaces/Meals/MealTypes";
import { formatDate } from "@/utils/formatDate";
import { IConsumptionHistory, IMenu, IReportMenu } from "@/Interfaces/Menu/menu";
import PercentageLineChart from "@/components/Charts/PercentageLineChart";
import { formatDateTime } from "@/utils/formatDateTime";
import { ReportsConsumptionHistoryItem } from "@/Interfaces/Reports/reports";
import theme from "@/theme/theme";
import { IProfilePermissionsItems } from "@/Interfaces/ProfilePermissions/profilePermissions";

const statusChipSx = {
  width: 100,
  justifyContent: "center",
  "& .MuiChip-label": {
    width: "100%",
    textAlign: "center",
  },
};

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
        sx={statusChipSx}
      />
    ),
  },
  { key: "tipo_usuario", label: "Tipo de Acesso" },
  { key: "ultima_refeicao", label: "Última Refeição" },
  {
    key: "acoes",
    label: "Ações",
    render: () => <></>,
  },
];

const stockColumns: IColumn<IStock>[] = [
  { key: "nome", label: "Nome" },
  { key: "categoria", label: "Categoria" },
  { key: "tipo_padrao", label: "Tipo Padrão" },
  { key: "unidade_medida", label: "Unidade de Medida" },
  { key: "quantidade_atual", label: "Quantidade Atual", align: "right" },
  { key: "ponto_reposicao", label: "Ponto de Reposição", align: "right" },
  {
    key: "ativo",
    label: "Status",
    render: (row) => (
      <Chip
        label={row.ativo ? "Ativo" : "Inativo"}
        color={row.ativo ? "success" : "default"}
        size="small"
        sx={statusChipSx}
      />
    ),
  },
  {
    key: "acoes",
    label: "Ações",
    render: () => <></>,
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
          sx={{ ...statusChipSx, textTransform: "capitalize" }}
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
          sx={{ ...statusChipSx, textTransform: "capitalize" }}
        />
      );
    },
  },
];

const menuColumns: IColumn<IMenu>[] = [
  {
    key: "data",
    label: "Data",
    render: (row) => (
      <Typography variant="body2">
        {formatDate(new Date(row.data), "dd/MM/yyyy")}
      </Typography>
    ),
  },
  {
    key: "unidade",
    label: "Unidade",
  },
  {
    key: "tipo",
    label: "Tipo de Refeição",
  },
  {
    key: "refeicoes",
    label: "Refeições",
    render: (row) => (
      <Typography variant="body2">{row.refeicoes.length} refeição{row.refeicoes.length > 1 ? "s" : ""}</Typography>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Chip
        label={row.status}
        color={row.status === "ativo" ? "success" : row.status === "programado" ? "info" : "default"}
        size="small"
        sx={{ ...statusChipSx, textTransform: "capitalize" }}
      />
    ),
  },
  {
    key: "acoes",
    label: "Ações",
    render: () => (<></>),
  },
];

const consumptionHistoryColumns: IColumn<IConsumptionHistory>[] = [
  {
    key: "nome",
    label: "Usuario",
    render: (row) => (
      <Typography variant="body2">{row.user.nome}</Typography>
    ),
  },
  {
    key: "matricula",
    label: "Matrícula",
    render: (row) => (
      <Typography variant="body2">{row.user.matricula}</Typography>
    ),
  },
  {
    key: "tipoRefeicao",
    label: "Tipo de Refeição",
    render: (row) => (
      <Typography variant="body2">{row.refeicao.categoria}</Typography>
    ),
  },
  {
    key: "data",
    label: "Data",
    render: (row) => (
      <Typography variant="body2">{formatDate(new Date(row.data), "dd/MM/yyyy")}</Typography>
    ),
  },
  {
    key: "horario",
    label: "Horário",
    render: (row) => (
      <Typography variant="body2">{formatDate(new Date(row.horario), "HH:mm")}</Typography>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      const colorMap: Record<string, "success" | "error"> = {
        liberado: "success",
        bloqueado: "error",
      };
      return (
        <Chip
          label={row.status}
          color={colorMap[row.status]}
          size="medium"
          sx={{ ...statusChipSx, textTransform: "capitalize" }}
        />
      );
    },
  },
  {
    key: "tipo",
    label: "Tipo",
    render: (row) => (
      <Chip
        label={row.tipo}
        color={row.tipo === "manual" ? "orange" : "default"}
        size="small"
        icon={row.tipo === "manual" ? <PaperIcon width={16} height={16} /> : undefined}
        sx={{ textTransform: "capitalize", gap: 0.5 }}
      />
    ),
  }
];

const reportsMenuColumns: IColumn<IReportMenu>[] = [
  {
    key: "data",
    label: "Data",
    render: (row) => (
      <Typography variant="body2">{formatDate(new Date(row.data), "dd/MM/yyyy")}</Typography>
    ),
  },
  {
    key: "categoria",
    label: "Tipo de Refeição",
  },
  {
    key: "planejado",
    label: "Planejado",
  },
  {
    key: "realizado",
    label: "Realizado",
  },
  {
    key: "variacao",
    label: "Variação",
    render: (row) => (
      <Chip
        label={row.variacao > 0 ? `+${row.variacao}%` : `${row.variacao}%`}
        color={row.variacao > 0 ? "success" : row.variacao < 0 ? "error" : "default"}
        size="small"
      />
    ),
  },
  {
    key: "eficiencia",
    label: "Eficiência",
    render: (row) => (
      <PercentageLineChart value={row.eficiencia} />
    ),
  }


];

const reportsConsumptionHistoryColumns: IColumn<ReportsConsumptionHistoryItem>[] = [
  {
    key: "data_hora",
    label: "Data/Hora",
    render: (row) => formatDateTime(row.data_hora),
  },
  {
    key: "usuario",
    label: "Usuário",
    render: (row) => (
      <Stack direction={{ md: "row" }} alignItems="center" gap={0.5}>
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
  { key: "terminal", label: "Terminal" },
  { key: "tipo", label: "Tipo de Refeição" },
  { key: "unidade", label: "Unidade" },
  { key: "matricula", label: "Matrícula" },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      const colorMap: Record<string, "success" | "error"> = {
        Servida: "success",
        Cancelada: "error",
      };
      return (
        <Chip
          label={row.status}
          color={colorMap[row.status]}
          size="small"
          sx={{ ...statusChipSx, textTransform: "capitalize" }}
        />
      );
    },
  },
];

const permissionsColumns: IColumn<IProfilePermissionsItems>[] = [
  { key: "modulo", label: "Módulo" },
  {
    key: "visualizar",
    label: "Visualizar",
    render: (row) => (
      row.visualizar ? (
        <CheckIcon color={theme.palette.success.contrastText} width={20} height={20} />
      ) : (
        <XIcon color={theme.palette.default.light} width={20} height={20} />
      )
    )
  },
  {
    key: "criar",
    label: "Criar",
    render: (row) => (
      row.criar ? (
        <CheckIcon color={theme.palette.success.contrastText} width={20} height={20} />
      ) : (
        <XIcon color={theme.palette.default.light} width={20} height={20} />
      )
    )
  },
  {
    key: "editar",
    label: "Editar",
    render: (row) => (
      row.editar ? (
        <CheckIcon color={theme.palette.success.contrastText} width={20} height={20} />
      ) : (
        <XIcon color={theme.palette.default.light} width={20} height={20} />
      )
    )
  },
  {
    key: "excluir",
    label: "Excluir",
    render: (row) => (
      row.excluir ? (
        <CheckIcon color={theme.palette.success.contrastText} width={20} height={20} />
      ) : (
        <XIcon color={theme.palette.default.light} width={20} height={20} />
      )
    )
  },
];


export {
  userColumns,
  stockColumns,
  movementColumns,
  extraRequestColumns,
  mealRecordsColumns,
  menuColumns,
  consumptionHistoryColumns,
  reportsMenuColumns,
  reportsConsumptionHistoryColumns,
  permissionsColumns,
};
