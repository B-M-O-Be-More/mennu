import { IColumn } from "@/components/Tables/Table";
import { IExtraRequest } from "@/Interfaces/ExtraRequest/extraRequestColumns";
import { IMovement } from "@/Interfaces/Movement/movement";
import { IStock } from "@/Interfaces/Stock/stock";
import { ISaldoEstoqueItem, ISaldoEstoqueConsolidado } from "@/Interfaces/Stock/saldoEstoque";
import { IUsuarioListItem } from "@/Interfaces/User/user";
import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import { CheckIcon, PaperIcon, XIcon } from "@/components/Icons";
import { MealRecordsResponse } from "@/Interfaces/Meals/MealTypes";
import { formatDate, formatDateOnly } from "@/utils/formatDate";
import { IConsumptionHistory, IMenu } from "@/Interfaces/Menu/menu";
import { ICardapioPlanejamentoRow } from "@/Interfaces/Reports/cardapioPlanejamento";
import PercentageLineChart from "@/components/Charts/PercentageLineChart";
import { formatDateTime } from "@/utils/formatDateTime";
import { ReportsConsumptionHistoryItem } from "@/Interfaces/Reports/reports";
import theme from "@/theme/theme";
import { ICargoUsuario, IProfilePermissionsItems } from "@/Interfaces/ProfilePermissions/profilePermissions";
import { IStockAudit, IStockAuditDetailItem } from "@/Interfaces/StockAudit/stockAudit";
import {
  formatAuditQuantity,
  formatAuditTolerance,
  isDraft,
  resolveStatus,
} from "@/utils/stockAuditUtils";
import dayjs from "dayjs";

const statusChipSx = {
  width: 100,
  justifyContent: "center",
  "& .MuiChip-label": {
    width: "100%",
    textAlign: "center",
  },
};

const userColumns: IColumn<IUsuarioListItem>[] = [
  {
    key: "nome",
    label: "Nome",
    render: (row) => {
      const displayName = row.nome?.trim() || row.documento;
      return (
        <Stack direction="row" alignItems="center">
          <Avatar
            sx={{
              bgcolor: "primary.main",
              mr: 1,
              width: 32,
              height: 32,
              fontSize: 14,
            }}>
            {displayName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </Avatar>
          <Typography variant="body2">{displayName}</Typography>
        </Stack>
      );
    },
  },
  { key: "matricula", label: "Matrícula" },
  {
    key: "unidade",
    label: "Unidade",
    align: "right",
    render: (row) => <>{row.unidade.nome}</>,
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Chip
        label={row.is_active ? "Ativo" : "Inativo"}
        color={row.is_active ? "success" : "default"}
        size="small"
        sx={statusChipSx}
      />
    ),
  },
  { key: "categoria_usuario", label: "Categoria" },
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
    render: (row) => dayjs(row.horario).format("HH:mm"),
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

const cardapioStatusColorMap: Record<string, "warning" | "info" | "success"> = {
  planejado: "warning",
  confirmado: "info",
  servido: "success",
};

const cardapioStatusLabelMap: Record<string, string> = {
  planejado: "Planejado",
  confirmado: "Confirmado",
  servido: "Servido",
};

const menuColumns: IColumn<IMenu>[] = [
  {
    key: "dataRefeicao",
    label: "Data",
    render: (row) => (
      <Typography variant="body2">
        {formatDateOnly(row.dataRefeicao)}
      </Typography>
    ),
  },
  {
    key: "unidadeNome",
    label: "Unidade",
  },
  {
    key: "tipoRefeicaoNome",
    label: "Tipo de Refeição",
  },
  {
    key: "pratos",
    label: "Pratos",
    render: (row) => (
      <Typography variant="body2">{row.pratos.length} prato{row.pratos.length > 1 ? "s" : ""}</Typography>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <Chip
        label={cardapioStatusLabelMap[row.status] ?? row.status}
        color={cardapioStatusColorMap[row.status] ?? "default"}
        size="small"
        sx={statusChipSx}
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
      <Typography variant="body2">{dayjs(row.horario).format("DD/MM/YYYY")}</Typography>
    ),
  },
  {
    key: "horario",
    label: "Horário",
    render: (row) => (
      <Typography variant="body2">{dayjs(row.horario).format("HH:mm")}</Typography>
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

const reportsMenuColumns: IColumn<ICardapioPlanejamentoRow>[] = [
  {
    key: "data",
    label: "Data",
    render: (row) => (
      <Typography variant="body2">{formatDateOnly(row.data)}</Typography>
    ),
  },
  {
    key: "unidade",
    label: "Unidade",
  },
  {
    key: "tipoRefeicao",
    label: "Tipo de Refeição",
  },
  {
    key: "previsto",
    label: "Previsto",
  },
  {
    key: "realizado",
    label: "Realizado",
  },
  {
    key: "aderencia",
    label: "Aderência",
    render: (row) => (
      <PercentageLineChart value={row.aderencia} />
    ),
  },
];

const reportsConsumptionHistoryColumns: IColumn<ReportsConsumptionHistoryItem>[] = [
  {
    key: "dataHora",
    label: "Data/Hora",
    render: (row) => formatDateTime(row.dataHora),
  },
  {
    key: "usuarioNome",
    label: "Usuário",
    render: (row) => (
      <Stack direction={{ md: "row" }} alignItems="center" gap={0.5}>
        <Typography variant="body2">{row.usuarioNome ?? "—"}</Typography>
        {row.manual && (
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
  { key: "unidadeNome", label: "Unidade", render: (row) => row.unidadeNome ?? "—" },
  { key: "usuarioMatricula", label: "Matrícula", render: (row) => row.usuarioMatricula ?? "—" },
];

const permissionsColumns: IColumn<IProfilePermissionsItems>[] = [
  { key: "modulo", label: "Módulo", render: (row) => row.label ?? row.modulo },
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


const cargoUsuariosColumns: IColumn<ICargoUsuario>[] = [
  {
    key: "nome",
    label: "Nome",
    render: (row) => <>{row.nome?.trim() || row.documento}</>,
  },
  {
    key: "matricula",
    label: "Matricula",
    render: (row) => <>{row.matricula || "-"}</>,
  },
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
    key: "data_inicio",
    label: "Vinculado em",
    align: "right",
    render: (row) => (
      <>{row.data_inicio ? formatDate(new Date(row.data_inicio), "dd/MM/yyyy") : "-"}</>
    ),
  },
  {
    key: "acoes",
    label: "Ações",
    align: "right",
    render: () => <></>,
  },
];

const cargoUsuariosSelecaoColumns: IColumn<IUsuarioListItem>[] = [
  {
    key: "selecionar",
    label: "",
    render: () => <></>,
  },
  {
    key: "nome",
    label: "Nome",
    render: (row) => <>{row.nome?.trim() || row.documento}</>,
  },
  {
    key: "matricula",
    label: "Matricula",
    render: (row) => <>{row.matricula || "-"}</>,
  },
  {
    key: "is_active",
    label: "Status",
    align: "right",
    render: (row) => (
      <Chip
        label={row.is_active ? "Ativo" : "Inativo"}
        color={row.is_active ? "success" : "default"}
        size="small"
        sx={statusChipSx}
      />
    ),
  },
];

const stockAuditColumns: IColumn<IStockAudit>[] = [
  {
    key: "criado_em",
    label: "Data/Hora",
    render: (row) => formatDateTime(row.criado_em) || "—",
  },
  {
    key: "unidade_nome",
    label: "Unidade",
    align: "center",
    render: (row) => row.unidade_nome ?? "—",
  },
  {
    key: "auditor_nome",
    label: "Auditor",
    align: "center",
    render: (row) => row.auditor_nome ?? "—",
  },
  { key: "total_itens", label: "itens", align: "center" },
  {
    key: "total_divergentes",
    label: "Divergencia",
    align: "center",
    // Rascunho ainda não teve divergência apurada (só é calculada no envio).
    render: (row) => (isDraft(row) ? "-----" : row.total_divergentes),
  },
  {
    key: "status",
    label: "Status",
    align: "center",
    render: (row) => {
      const { label, color } = resolveStatus(row.status);

      return (
        <Chip
          label={label}
          color={color}
          size="small"
          sx={{ ...statusChipSx, width: "auto", minWidth: 130 }}
        />
      );
    },
  },
  // A ação depende da página (abrir x continuar): o render é sobrescrito por
  // quem monta a tabela, como já é feito em `stockColumns.acoes`.
  { key: "acoes", label: "Ações", align: "center", render: () => null },
];

const auditConferenceColumns: IColumn<IStockAuditDetailItem>[] = [
  { key: "insumo_nome", label: "Insumo" },
  {
    key: "quantidade_teorica",
    label: "Teórico",
    align: "center",
    render: (row) => formatAuditQuantity(row.quantidade_teorica, row.unidade_medida),
  },
  {
    key: "quantidade_encontrada",
    label: "Encontrado",
    align: "center",
    render: (row) =>
      formatAuditQuantity(row.quantidade_encontrada, row.unidade_medida),
  },
  {
    key: "divergencia",
    label: "Diferença",
    align: "center",
    render: (row) =>
      formatAuditQuantity(row.divergencia, row.unidade_medida, { signed: true }),
  },
  {
    key: "tolerancia_valor",
    label: "Tolerância",
    align: "center",
    render: (row) => formatAuditTolerance(row),
  },
  {
    key: "divergente",
    label: "Status",
    align: "center",
    render: (row) => (
      <Chip
        label={row.divergente ? "Divergencia" : "Dentro do limite"}
        color={row.divergente ? "error" : "success"}
        size="small"
        sx={{ ...statusChipSx, width: "auto", minWidth: 130 }}
      />
    ),
  },
];

const auditNormalizeColumns: IColumn<IStockAuditDetailItem>[] = [
  { key: "insumo_nome", label: "Insumo" },
  {
    key: "quantidade_encontrada",
    label: "Encontrado pelo Auditor",
    align: "center",
    render: (row) =>
      formatAuditQuantity(row.quantidade_encontrada, row.unidade_medida),
  },
  // Campo e ajuste dependem do que o usuário digita: o render é sobrescrito
  // por quem monta a tabela.
  { key: "apos_normalizacao", label: "Após Normalização", align: "center", render: () => null },
  { key: "ajuste", label: "Ajuste", align: "center", render: () => null },
];

const saldoEstoqueColumns: IColumn<ISaldoEstoqueItem>[] = [
  { key: "insumoNome", label: "Insumo", render: (row) => row.insumoNome ?? "—" },
  { key: "unidadeNome", label: "Unidade", render: (row) => row.unidadeNome ?? "—" },
  { key: "lote", label: "Lote", render: (row) => row.lote ?? "—" },
  { key: "validade", label: "Validade", render: (row) => formatDateOnly(row.validade) },
  { key: "quantidade", label: "Quantidade", align: "right" },
  { key: "unidadeMedida", label: "Un. Medida", render: (row) => row.unidadeMedida ?? "—" },
];

const saldoEstoqueConsolidadoColumns: IColumn<ISaldoEstoqueConsolidado>[] = [
  { key: "insumoNome", label: "Insumo" },
  { key: "quantidade", label: "Quantidade", align: "right" },
  { key: "unidadeMedida", label: "Un. Medida" },
  {
    key: "validadeMaisProxima",
    label: "Validade Mais Próxima",
    render: (row) => formatDateOnly(row.validadeMaisProxima),
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
  cargoUsuariosColumns,
  cargoUsuariosSelecaoColumns,
  stockAuditColumns,
  auditConferenceColumns,
  auditNormalizeColumns,
  saldoEstoqueColumns,
  saldoEstoqueConsolidadoColumns,
};
