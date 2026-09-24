import { IColumn } from "@/components/Tables/Table";
import { IExtraRequest } from "@/Interfaces/ExtraRequest/extraRequestColumns";
import { IMovement, MovementTipo } from "@/Interfaces/Movement/movement";
import { IStock } from "@/Interfaces/Stock/stock";
import { ISaldoEstoqueItem, ISaldoEstoqueConsolidado } from "@/Interfaces/Stock/saldoEstoque";
import { IUsuarioListItem } from "@/Interfaces/User/user";
import { Avatar, Box, Chip, Stack, Tooltip, Typography } from "@mui/material";
import { CheckIcon, PaperIcon, XIcon } from "@/components/Icons";
import { MealRecordsResponse } from "@/Interfaces/Meals/MealTypes";
import { formatDate, formatDateOnly } from "@/utils/formatDate";
import { IConsumptionHistory, IMenu } from "@/Interfaces/Menu/menu";
import { ICardapioPlanejamentoRow, IInsumoVariacaoRow } from "@/Interfaces/Reports/cardapioPlanejamento";
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
import { IAcessoRow } from "@/Interfaces/Reports/acesso";
import { IAuditoriaRow } from "@/Interfaces/Reports/auditoria";
import { IPresencaRow } from "@/Interfaces/Reports/presenca";
import { ITerminaisRow } from "@/Interfaces/Reports/terminais";
import { IUsuariosReportRow } from "@/Interfaces/Reports/usuarios";
import { IConsumoRow } from "@/Interfaces/Reports/consumo";
import { IDesperdicioRow } from "@/Interfaces/Reports/desperdicio";
import {
  IInventarioRow,
  IHistoricoMovimentacaoRow,
  IConsumoEstoqueRow,
} from "@/Interfaces/Reports/estoque";

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
  {
    key: "cargos",
    label: "Cargos",
    render: (row) => {
      const cargos = row.cargos ?? [];

      if (cargos.length === 0) {
        return (
          <Typography variant="body2" color="text.secondary">
            Sem cargo
          </Typography>
        );
      }

      return (
        <Stack direction="row" gap={0.5} flexWrap="wrap">
          {cargos.map((cargo) => (
            <Tooltip
              key={`${cargo.id}-${cargo.unidade?.id ?? "global"}`}
              title={cargo.unidade?.nome ?? "Todas as unidades"}
            >
              <Chip label={cargo.nome} size="small" variant="outlined" />
            </Tooltip>
          ))}
        </Stack>
      );
    },
  },
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
        MovementTipo,
        "success" | "info" | "error" | "purple"
      > = {
        entrada: "success",
        transferencia_entrada: "success",
        saida: "info",
        transferencia_saida: "info",
        perda: "error",
        inventario: "purple",
      };
      const labelMap: Record<MovementTipo, string> = {
        entrada: "Entrada",
        saida: "Saída",
        perda: "Perda",
        inventario: "Inventário",
        transferencia_saida: "Transferência (saída)",
        transferencia_entrada: "Transferência (entrada)",
      };

      return (
        <Chip
          label={labelMap[row.tipo] ?? row.tipo}
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

const acessoColumns: IColumn<IAcessoRow>[] = [
  { key: "dataHora", label: "Data/Hora", render: (row) => formatDateTime(row.dataHora) },
  { key: "terminal", label: "Terminal" },
  { key: "unidade", label: "Unidade" },
  { key: "usuario", label: "Usuário" },
  { key: "tipoRefeicao", label: "Tipo de Refeição" },
  {
    key: "sucesso",
    label: "Resultado",
    render: (row) => (
      <Chip
        label={row.sucesso ? "Sucesso" : "Falha"}
        color={row.sucesso ? "success" : "error"}
        size="small"
      />
    ),
  },
  { key: "mensagemErro", label: "Motivo da Falha", render: (row) => row.mensagemErro || "—" },
];

const auditoriaRelatorioColumns: IColumn<IAuditoriaRow>[] = [
  { key: "dataReferencia", label: "Data", render: (row) => formatDateOnly(row.dataReferencia) },
  { key: "unidade", label: "Unidade" },
  { key: "auditor", label: "Auditor" },
  { key: "insumo", label: "Insumo" },
  {
    key: "quantidadeTeorica",
    label: "Teórico",
    align: "right",
    render: (row) => (row.quantidadeTeorica === null ? "—" : `${row.quantidadeTeorica} ${row.unidadeMedida}`),
  },
  {
    key: "quantidadeEncontrada",
    label: "Encontrado",
    align: "right",
    render: (row) => (row.quantidadeEncontrada === null ? "—" : `${row.quantidadeEncontrada} ${row.unidadeMedida}`),
  },
  {
    key: "divergente",
    label: "Divergência",
    render: (row) => (
      <Chip
        label={row.divergente ? "Divergente" : "OK"}
        color={row.divergente ? "warning" : "success"}
        size="small"
      />
    ),
  },
  { key: "status", label: "Status" },
];

const presencaColumns: IColumn<IPresencaRow>[] = [
  { key: "usuarioNome", label: "Usuário" },
  { key: "matricula", label: "Matrícula" },
  { key: "categoria", label: "Categoria" },
  { key: "unidade", label: "Unidade" },
  { key: "totalRefeicoes", label: "Total de Refeições", align: "right" },
  { key: "diasComRefeicao", label: "Dias com Refeição", align: "right" },
  { key: "frequenciaPercentual", label: "Frequência (%)", align: "right" },
  {
    key: "ultimaRefeicao",
    label: "Última Refeição",
    render: (row) => (row.ultimaRefeicao ? formatDateTime(row.ultimaRefeicao) : "—"),
  },
];

const terminaisColumns: IColumn<ITerminaisRow>[] = [
  { key: "nome", label: "Terminal" },
  { key: "tipo", label: "Tipo" },
  { key: "unidade", label: "Unidade" },
  {
    key: "statusAtual",
    label: "Status",
    render: (row) => (
      <Chip
        label={row.statusAtual}
        color={row.statusAtual === "online" ? "success" : "default"}
        size="small"
        sx={{ textTransform: "capitalize" }}
      />
    ),
  },
  {
    key: "ultimoPing",
    label: "Último Ping",
    render: (row) => (row.ultimoPing ? formatDateTime(row.ultimoPing) : "nunca"),
  },
  { key: "totalAcessos", label: "Total de Acessos", align: "right" },
  { key: "taxaSucesso", label: "Taxa de Sucesso (%)", align: "right" },
];

const usuariosReportColumns: IColumn<IUsuariosReportRow>[] = [
  { key: "nome", label: "Nome" },
  { key: "email", label: "E-mail" },
  { key: "matricula", label: "Matrícula" },
  { key: "categoria", label: "Categoria" },
  {
    key: "ativo",
    label: "Status",
    render: (row) => (
      <Chip label={row.ativo ? "Ativo" : "Inativo"} color={row.ativo ? "success" : "default"} size="small" />
    ),
  },
  {
    key: "possuiNfc",
    label: "NFC",
    render: (row) => (
      <Chip label={row.possuiNfc ? "Sim" : "Não"} color={row.possuiNfc ? "info" : "default"} size="small" />
    ),
  },
  { key: "unidades", label: "Unidades" },
];

const consumoColumns: IColumn<IConsumoRow>[] = [
  { key: "nome", label: "Insumo" },
  { key: "categoria", label: "Categoria" },
  { key: "unidadeMedida", label: "Un. Medida" },
  { key: "totalEntrada", label: "Total Entrada", align: "right" },
  { key: "totalSaida", label: "Total Saída", align: "right" },
  { key: "saldoPeriodo", label: "Saldo no Período", align: "right" },
];

const desperdicioColumns: IColumn<IDesperdicioRow>[] = [
  { key: "nome", label: "Insumo" },
  { key: "categoria", label: "Categoria" },
  { key: "unidadeMedida", label: "Un. Medida" },
  { key: "totalPerda", label: "Total Perdido", align: "right" },
  { key: "percentualPerda", label: "% da Perda", align: "right" },
];

const inventarioColumns: IColumn<IInventarioRow>[] = [
  { key: "nome", label: "Insumo" },
  { key: "categoria", label: "Categoria" },
  { key: "unidadeMedida", label: "Un. Medida" },
  { key: "quantidadeAtual", label: "Quantidade Atual", align: "right" },
  { key: "pontoReposicao", label: "Ponto de Reposição", align: "right" },
  {
    key: "statusEstoque",
    label: "Status",
    render: (row) => {
      const colorMap: Record<IInventarioRow["statusEstoque"], "success" | "warning" | "error"> = {
        normal: "success",
        baixo: "warning",
        critico: "error",
      };
      return (
        <Chip
          label={row.statusEstoque}
          color={colorMap[row.statusEstoque]}
          size="small"
          sx={{ textTransform: "capitalize" }}
        />
      );
    },
  },
];

const historicoMovimentacaoColumns: IColumn<IHistoricoMovimentacaoRow>[] = [
  { key: "data", label: "Data", render: (row) => formatDateTime(row.data) },
  { key: "tipo", label: "Tipo" },
  { key: "insumo", label: "Item" },
  { key: "unidade", label: "Unidade" },
  { key: "quantidade", label: "Quantidade", align: "right" },
  { key: "responsavel", label: "Responsável" },
];

const consumoEstoqueColumns: IColumn<IConsumoEstoqueRow>[] = [
  { key: "nome", label: "Insumo" },
  { key: "unidadeMedida", label: "Un. Medida" },
  { key: "totalEntrada", label: "Total Entrada", align: "right" },
  { key: "totalSaida", label: "Total Saída", align: "right" },
  { key: "totalPerda", label: "Total Perdido", align: "right" },
  { key: "saldoPeriodo", label: "Saldo no Período", align: "right" },
];

// Colunas "extras" — ligadas via <ReportColumnsMenu/>, começam ocultas pra
// manter a tabela padrão enxuta (menos scroll horizontal, menos ruído).
const auditoriaOptionalColumns: IColumn<IAuditoriaRow>[] = [
  {
    key: "divergencia",
    label: "Divergência (qtd)",
    align: "right",
    render: (row) => (row.divergencia === null ? "—" : `${row.divergencia} ${row.unidadeMedida}`),
  },
  { key: "observacao", label: "Observação", render: (row) => row.observacao || "—" },
  {
    key: "normalizada",
    label: "Normalizada",
    render: (row) =>
      row.divergente ? (
        <Chip label={row.normalizada ? "Normalizada" : "Pendente"} color={row.normalizada ? "success" : "warning"} size="small" />
      ) : (
        "—"
      ),
  },
];

const terminaisOptionalColumns: IColumn<ITerminaisRow>[] = [
  { key: "versaoSoftware", label: "Versão", render: (row) => row.versaoSoftware ?? "—" },
  { key: "ipAddress", label: "IP", render: (row) => row.ipAddress ?? "—" },
  { key: "acessosSucesso", label: "Acessos com Sucesso", align: "right" },
];

const usuariosOptionalColumns: IColumn<IUsuariosReportRow>[] = [
  {
    key: "dataCadastro",
    label: "Data de Cadastro",
    render: (row) => (row.dataCadastro ? formatDateOnly(row.dataCadastro) : "—"),
  },
];

const inventarioOptionalColumns: IColumn<IInventarioRow>[] = [
  { key: "tipoPadrao", label: "Tipo Padrão" },
];

const historicoMovimentacaoOptionalColumns: IColumn<IHistoricoMovimentacaoRow>[] = [
  { key: "motivo", label: "Motivo", render: (row) => row.motivo || "—" },
  { key: "justificativa", label: "Justificativa", render: (row) => row.justificativa || "—" },
  { key: "lote", label: "Lote", render: (row) => row.lote || "—" },
  {
    key: "validade",
    label: "Validade",
    render: (row) => (row.validade ? formatDateOnly(row.validade) : "—"),
  },
];

const insumoVariacaoColumns: IColumn<IInsumoVariacaoRow>[] = [
  { key: "insumo", label: "Insumo" },
  { key: "unidadeMedida", label: "Un. Medida" },
  { key: "qtdPrevista", label: "Qtd. Prevista", align: "right" },
  { key: "qtdReal", label: "Qtd. Real", align: "right", render: (row) => row.qtdReal ?? "—" },
  { key: "variacao", label: "Variação", align: "right", render: (row) => row.variacao ?? "—" },
  {
    key: "variacaoPercentual",
    label: "Variação (%)",
    align: "right",
    render: (row) => (row.variacaoPercentual === null ? "—" : `${row.variacaoPercentual.toFixed(1)}%`),
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
  acessoColumns,
  auditoriaRelatorioColumns,
  presencaColumns,
  terminaisColumns,
  usuariosReportColumns,
  consumoColumns,
  desperdicioColumns,
  inventarioColumns,
  historicoMovimentacaoColumns,
  consumoEstoqueColumns,
  auditoriaOptionalColumns,
  terminaisOptionalColumns,
  usuariosOptionalColumns,
  inventarioOptionalColumns,
  historicoMovimentacaoOptionalColumns,
  insumoVariacaoColumns,
};
