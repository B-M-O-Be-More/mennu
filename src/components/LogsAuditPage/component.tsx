"use client";

import React from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Cards/Card";
import Input from "@/components/FormControl/Input";
import Table, { IColumn } from "@/components/Tables/Table";
import { DownloadIcon, EyeIcon, SearchIcon } from "@/components/Icons";
import { useDebounce } from "@/hooks/useDebounce/hook";
import {
  ILogAuditDetail,
  ILogAuditFilters,
  ILogAuditListItem,
  ILogAuditResponse,
  ILogAuditStats,
} from "@/Interfaces/LogAudit/logAudit";
import { LogsAuditPageProps } from "./interface";

const PAGE_SIZE = 5;
const STATUS_OPTIONS = [
  { label: "Todos os status", value: "all" },
  { label: "Sucesso", value: "sucesso" },
  { label: "Erro", value: "erro" },
  { label: "Aviso", value: "aviso" },
];

const DEFAULT_STATS: ILogAuditStats = {
  total_eventos: 0,
  total_sucessos: 0,
  total_erros: 0,
  total_avisos: 0,
};

const RETENTION_ITEMS = [
  "Logins e logouts são registrados automaticamente",
  "Todas as alterações em permissões são auditadas",
  "Tentativas de acesso não autorizado geram alertas imediatos",
];

type DetailField = {
  label: string;
  value: string;
  icon: React.ReactNode;
  fullWidth?: boolean;
};

type SummaryCardData = {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
};

function normalizeStatus(status?: string | null) {
  const normalized = String(status ?? "").trim().toLowerCase();
  if (normalized.includes("sucesso")) return "sucesso";
  if (normalized.includes("erro") || normalized.includes("falha")) return "erro";
  if (normalized.includes("aviso") || normalized.includes("warn")) return "aviso";
  return "default";
}

function getStatusConfig(status?: string | null) {
  const normalized = normalizeStatus(status);

  if (normalized === "sucesso") {
    return {
      label: "Sucesso",
      icon: <CheckCircleOutlineRoundedIcon sx={{ fontSize: 18, color: "#00A63E" }} />,
      iconBg: "#F0FDF4",
      chipSx: {
        bgcolor: "#F0FDF4",
        color: "#00A63E",
        borderColor: "#B9F8CF",
      },
      bannerSx: {
        bgcolor: "#F0FDF4",
        borderColor: "#B9F8CF",
      },
      headingColor: "#008236",
      bodyColor: "#00A63E",
      statIcon: <CheckCircleOutlineRoundedIcon sx={{ fontSize: 28, color: "#00A63E" }} />,
      statBg: "#F0FDF4",
    };
  }

  if (normalized === "erro") {
    return {
      label: "Erro",
      icon: <ErrorOutlineRoundedIcon sx={{ fontSize: 18, color: "#E7000B" }} />,
      iconBg: "#FEF2F2",
      chipSx: {
        bgcolor: "#FEF2F2",
        color: "#E7000B",
        borderColor: "#FFC9C9",
      },
      bannerSx: {
        bgcolor: "#FEF2F2",
        borderColor: "#FFC9C9",
      },
      headingColor: "#C10007",
      bodyColor: "#E7000B",
      statIcon: <ErrorOutlineRoundedIcon sx={{ fontSize: 28, color: "#E7000B" }} />,
      statBg: "#FEF2F2",
    };
  }

  if (normalized === "aviso") {
    return {
      label: "Aviso",
      icon: <WarningAmberRoundedIcon sx={{ fontSize: 18, color: "#E17100" }} />,
      iconBg: "#FFFBEB",
      chipSx: {
        bgcolor: "#FFFBEB",
        color: "#BB4D00",
        borderColor: "#FEE685",
      },
      bannerSx: {
        bgcolor: "#FFFBEB",
        borderColor: "#FEE685",
      },
      headingColor: "#BB4D00",
      bodyColor: "#E17100",
      statIcon: <WarningAmberRoundedIcon sx={{ fontSize: 28, color: "#E17100" }} />,
      statBg: "#FFFBEB",
    };
  }

  return {
    label: status || "Indefinido",
    icon: <InfoOutlinedIcon sx={{ fontSize: 18, color: "#155DFC" }} />,
    iconBg: "#EFF6FF",
    chipSx: {
      bgcolor: "#EFF6FF",
      color: "#155DFC",
      borderColor: "#BEDBFF",
    },
    bannerSx: {
      bgcolor: "#EFF6FF",
      borderColor: "#BEDBFF",
    },
    headingColor: "#1C398E",
    bodyColor: "#155DFC",
    statIcon: <InfoOutlinedIcon sx={{ fontSize: 28, color: "#155DFC" }} />,
    statBg: "#EFF6FF",
  };
}

function formatDateTime(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}

function formatDetailValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function pickDetailValue(
  details: Record<string, unknown> | undefined,
  keys: string[],
) {
  if (!details) return undefined;

  for (const [entryKey, entryValue] of Object.entries(details)) {
    if (keys.includes(entryKey.toLowerCase())) {
      return entryValue;
    }
  }

  return undefined;
}

function buildDetailFields(log: ILogAuditDetail): DetailField[] {
  const details = log.detalhes;
  const profile =
    pickDetailValue(details, ["perfil", "cargo", "role", "papel"]) ?? "-";
  const responseTime =
    pickDetailValue(details, [
      "tempo_resposta",
      "tempo_resposta_ms",
      "response_time",
      "response_time_ms",
      "latencia",
      "latency_ms",
    ]) ?? "-";
  const userAgent =
    log.user_agent ??
    pickDetailValue(details, ["user_agent", "useragent", "agent", "browser"]) ??
    "-";

  return [
    {
      label: "Timestamp",
      value: formatDateTime(log.criado_em),
      icon: <AccessTimeRoundedIcon sx={{ fontSize: 16, color: "#98A2B3" }} />,
    },
    {
      label: "Usuário",
      value: log.usuario_email || "-",
      icon: <PersonOutlineRoundedIcon sx={{ fontSize: 16, color: "#98A2B3" }} />,
    },
    {
      label: "Perfil",
      value: formatDetailValue(profile),
      icon: <ShieldOutlinedIcon sx={{ fontSize: 16, color: "#98A2B3" }} />,
    },
    {
      label: "Módulo",
      value: log.modulo || "-",
      icon: <LayersOutlinedIcon sx={{ fontSize: 16, color: "#98A2B3" }} />,
    },
    {
      label: "Endereço IP",
      value: log.ip_address || "-",
      icon: <PublicRoundedIcon sx={{ fontSize: 16, color: "#98A2B3" }} />,
    },
    {
      label: "Tempo de Resposta",
      value: formatDetailValue(responseTime),
      icon: <AccessTimeRoundedIcon sx={{ fontSize: 16, color: "#98A2B3" }} />,
    },
    {
      label: "User Agent",
      value: formatDetailValue(userAgent),
      icon: <InfoOutlinedIcon sx={{ fontSize: 16, color: "#98A2B3" }} />,
      fullWidth: true,
    },
  ];
}

function getDetailMessage(log: ILogAuditDetail) {
  const details = log.detalhes;
  const explicitMessage = pickDetailValue(details, [
    "mensagem",
    "message",
    "descricao",
    "description",
    "detalhe",
    "detail",
  ]);

  if (explicitMessage) return formatDetailValue(explicitMessage);

  const status = normalizeStatus(log.status);
  if (status === "sucesso") {
    return "Ação concluída com sucesso no sistema.";
  }
  if (status === "erro") {
    return "A operação registrou falha e precisa de análise.";
  }
  if (status === "aviso") {
    return "A operação foi concluída com atenção ou comportamento inesperado.";
  }
  return "Evento registrado no sistema.";
}

function SummaryCard({
  title,
  value,
  icon,
  iconBg,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <Card
      spacing={0}
      sx={{
        p: 0,
        minHeight: 138,
        justifyContent: "center",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2.25} sx={{ px: 3, py: 3.5 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2.5,
            bgcolor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Stack spacing={0.5}>
          <Typography sx={{ fontSize: 16, color: "text.secondary", lineHeight: 1.35 }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: 36, lineHeight: 1, fontWeight: 400 }}>
            {value}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  width,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  width: { xs: string; lg: number } | { xs: string; lg: string };
}) {
  return (
    <FormControl sx={{ width }}>
      <TextField
        select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            minHeight: 50,
            borderRadius: 3,
            fontSize: 14,
            "& fieldset": {
              borderColor: "divider",
              transition: "border-color 0.2s ease",
            },
            "&.Mui-focused fieldset": {
              borderColor: "primary.main",
            },
          },
          "& .MuiSelect-select": {
            color: value === "all" ? "text.secondary" : "text.primary",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
}

function LogDetailsDialog({
  log,
  open,
  onClose,
}: {
  log: ILogAuditDetail | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!log) return null;

  const statusConfig = getStatusConfig(log.status);
  const detailFields = buildDetailFields(log);
  const message = getDetailMessage(log);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            maxWidth: 710,
            boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 4,
          py: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "grey.100",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: "rgba(255, 61, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
            }}
          >
            <ArticleOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 32, lineHeight: 1.4, fontWeight: 600 }}>
              Detalhes do Log
            </Typography>
            <Typography sx={{ fontSize: 18, color: "text.secondary", lineHeight: 1.5 }}>
              ID #{log.id}
            </Typography>
          </Box>
        </Stack>

        <IconButton onClick={onClose} sx={{ color: "#667085" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 3 }}>
        <Box
          sx={{
            border: "1px solid",
            borderRadius: 2.5,
            px: 2.5,
            py: 2,
            display: "flex",
            gap: 1.5,
            alignItems: "center",
            ...statusConfig.bannerSx,
          }}
        >
          {statusConfig.icon}
          <Stack spacing={0.25}>
            <Typography sx={{ fontSize: 18, lineHeight: 1.6, color: statusConfig.headingColor }}>
              {log.acao}
            </Typography>
            <Typography sx={{ fontSize: 18, lineHeight: 1.6, color: statusConfig.bodyColor }}>
              {message}
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            mt: 3,
            display: "grid",
            gap: 2.5,
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          }}
        >
          {detailFields.map((field, index) => (
            <Box
              key={`${field.label}-${index}`}
              sx={{
                gridColumn: field.fullWidth ? { xs: "span 1", md: "span 2" } : "auto",
                bgcolor: "background.default",
                borderRadius: 2.5,
                px: 2,
                py: 1.5,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" mb={0.75}>
                {field.icon}
                <Typography
                  sx={{
                    fontSize: 12,
                    lineHeight: 1.35,
                    letterSpacing: "0.025em",
                    color: "#98A2B3",
                    textTransform: "uppercase",
                  }}
                >
                  {field.label}
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: 18, lineHeight: 1.6, color: "text.primary" }}>
                {field.value}
              </Typography>
            </Box>
          ))}
        </Box>

        <Stack direction="row" justifyContent="flex-end" mt={3}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              bgcolor: "grey.100",
              color: "text.label",
              outline: "none",
              minWidth: 101,
              "&:hover": {
                bgcolor: "grey.200",
              },
            }}
          >
            Fechar
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default function LogsAuditPage({}: LogsAuditPageProps) {
  const [filters, setFilters] = React.useState<ILogAuditFilters>({
    search: "",
    modulo: "all",
    status: "all",
  });
  const [logsResponse, setLogsResponse] = React.useState<ILogAuditResponse | null>(null);
  const [stats, setStats] = React.useState<ILogAuditStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingStats, setIsLoadingStats] = React.useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [detailsError, setDetailsError] = React.useState<string | null>(null);
  const [selectedLog, setSelectedLog] = React.useState<ILogAuditDetail | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const logsRequestId = React.useRef(0);
  const statsRequestId = React.useRef(0);
  const detailsRequestId = React.useRef(0);
  const debouncedSearch = useDebounce(filters.search, 500);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(PAGE_SIZE);

  const loadLogs = React.useCallback(async (signal: AbortSignal) => {
    const requestId = ++logsRequestId.current;
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(rowsPerPage),
      });

      if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
      if (filters.modulo !== "all") params.set("modulo", filters.modulo);
      if (filters.status !== "all") params.set("status", filters.status);

      const response = await fetch(`/api/logs-auditoria?${params.toString()}`, {
        signal,
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao carregar logs" }));
        throw new Error(errData.message ?? "Erro ao carregar logs");
      }

      const payload: ILogAuditResponse = await response.json();
      if (requestId === logsRequestId.current) setLogsResponse(payload);
    } catch (err) {
      if (!signal.aborted && requestId === logsRequestId.current) {
        setError(err instanceof Error ? err.message : "Erro ao carregar logs");
        setLogsResponse(null);
      }
    } finally {
      if (requestId === logsRequestId.current) setIsLoading(false);
    }
  }, [debouncedSearch, filters.modulo, filters.status, page, rowsPerPage]);

  const loadStats = React.useCallback(async (signal: AbortSignal) => {
    const requestId = ++statsRequestId.current;
    setIsLoadingStats(true);

    try {
      const params = new URLSearchParams();

      if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
      if (filters.modulo !== "all") params.set("modulo", filters.modulo);
      if (filters.status !== "all") params.set("status", filters.status);

      const response = await fetch(`/api/logs-auditoria/stats?${params.toString()}`, {
        signal,
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao carregar estatísticas" }));
        throw new Error(errData.message ?? "Erro ao carregar estatísticas");
      }

      const payload: ILogAuditStats = await response.json();
      if (requestId === statsRequestId.current) setStats(payload);
    } catch {
      if (!signal.aborted && requestId === statsRequestId.current) {
        setStats(DEFAULT_STATS);
      }
    } finally {
      if (requestId === statsRequestId.current) setIsLoadingStats(false);
    }
  }, [debouncedSearch, filters.modulo, filters.status]);

  React.useEffect(() => {
    const controller = new AbortController();
    void loadLogs(controller.signal);

    return () => controller.abort();
  }, [loadLogs]);

  React.useEffect(() => {
    const controller = new AbortController();
    void loadStats(controller.signal);

    return () => controller.abort();
  }, [loadStats]);

  const updateFilters = (updates: Partial<ILogAuditFilters>) => {
    setFilters((previous) => ({ ...previous, ...updates }));
    setPage(1);
  };

  const moduleOptions = React.useMemo(() => {
    const modules = new Set<string>();

    (logsResponse?.results ?? []).forEach((log) => {
      if (log.modulo) modules.add(log.modulo);
    });

    return [
      { label: "Todos os módulos", value: "all" },
      ...Array.from(modules).map((modulo) => ({
        label: modulo,
        value: modulo,
      })),
    ];
  }, [logsResponse?.results]);

  const rows = logsResponse?.results ?? [];
  const pagination = logsResponse?.metadados;

  const handleViewDetails = async (log: ILogAuditListItem) => {
    const requestId = ++detailsRequestId.current;
    setIsDialogOpen(true);
    setSelectedLog(null);
    setDetailsError(null);
    setIsLoadingDetails(true);

    try {
      const response = await fetch(`/api/logs-auditoria/${log.id}`);

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao carregar detalhes do log" }));
        throw new Error(errData.message ?? "Erro ao carregar detalhes do log");
      }

      const payload: ILogAuditDetail = await response.json();
      if (requestId === detailsRequestId.current) setSelectedLog(payload);
    } catch (err) {
      if (requestId === detailsRequestId.current) {
        setDetailsError(
          err instanceof Error ? err.message : "Erro ao carregar detalhes do log",
        );
      }
    } finally {
      if (requestId === detailsRequestId.current) setIsLoadingDetails(false);
    }
  };

  const closeDetails = () => {
    detailsRequestId.current += 1;
    setIsDialogOpen(false);
    setSelectedLog(null);
    setDetailsError(null);
    setIsLoadingDetails(false);
  };

  const handleExport = () => {
    const params = new URLSearchParams();

    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (filters.modulo !== "all") params.set("modulo", filters.modulo);
    if (filters.status !== "all") params.set("status", filters.status);

    const query = params.toString();
    const url = query
      ? `/api/logs-auditoria/exportar?${query}`
      : "/api/logs-auditoria/exportar";

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handlePageChange = (nextPage: number) => setPage(nextPage + 1);

  const handleRowsPerPageChange = (nextRowsPerPage: number) => {
    setRowsPerPage(nextRowsPerPage);
    setPage(1);
  };

  const summaryCards: SummaryCardData[] = [
    {
      title: "Total de Eventos",
      value: stats.total_eventos,
      icon: <ShieldOutlinedIcon sx={{ fontSize: 28, color: "#155DFC" }} />,
      iconBg: "#EFF6FF",
    },
    {
      title: "Sucessos",
      value: stats.total_sucessos,
      icon: getStatusConfig("sucesso").statIcon,
      iconBg: getStatusConfig("sucesso").statBg,
    },
    {
      title: "Erros",
      value: stats.total_erros,
      icon: getStatusConfig("erro").statIcon,
      iconBg: getStatusConfig("erro").statBg,
    },
    {
      title: "Avisos",
      value: stats.total_avisos,
      icon: getStatusConfig("aviso").statIcon,
      iconBg: getStatusConfig("aviso").statBg,
    },
  ];

  const columns: IColumn<ILogAuditListItem>[] = [
    {
      key: "criado_em",
      label: "Timestamp",
      render: (log) => formatDateTime(log.criado_em),
    },
    {
      key: "usuario_email",
      label: "Usuário",
      render: (log) => (
        <Stack spacing={0.25}>
          <Typography variant="body2">{log.usuario_email}</Typography>
          <Typography variant="caption" color="text.secondary">
            Log #{log.id}
          </Typography>
        </Stack>
      ),
    },
    { key: "acao", label: "Ação" },
    {
      key: "modulo",
      label: "Módulo",
      render: (log) => (
        <Chip
          label={log.modulo}
          variant="outlined"
          size="small"
          sx={{ bgcolor: "grey.100", border: "none", color: "text.secondary" }}
        />
      ),
    },
    {
      key: "ip_address",
      label: "IP",
      render: (log) => log.ip_address || "-",
    },
    {
      key: "status",
      label: "Status",
      render: (log) => {
        const statusConfig = getStatusConfig(log.status);

        return (
          <Stack direction="row" spacing={1} alignItems="center">
            {statusConfig.icon}
            <Chip
              label={statusConfig.label}
              variant="outlined"
              size="small"
              sx={{ ...statusConfig.chipSx, textTransform: "capitalize" }}
            />
          </Stack>
        );
      },
    },
    {
      key: "details",
      label: "Ação",
      render: (log) => (
        <Button
          variant="text"
          startIcon={<EyeIcon width={14} height={14} color="#FF3D00" />}
          onClick={() => handleViewDetails(log)}
          sx={{ color: "primary.main", px: 0, minWidth: 0 }}
        >
          Ver detalhes
        </Button>
      ),
    },
  ];

  return (
    <Stack gap={2.5}>
      <PageHeader
        title="Logs e Auditoria"
        subtitle="Registros de atividades e eventos do sistema"
      >
        <Button
          variant="contained"
          startIcon={<DownloadIcon width={18} height={18} />}
          onClick={handleExport}
          sx={{ minWidth: 188, py: 1.6 }}
        >
          Exportar Logs
        </Button>
      </PageHeader>

      <Card
        sx={{
          bgcolor: "info.main",
          borderColor: "info.light",
          p: 0,
          overflow: "hidden",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ px: 3, py: 3 }}>
          <Box sx={{ pt: 0.25, color: "info.contrastText" }}>
            <ShieldOutlinedIcon sx={{ fontSize: 25 }} />
          </Box>
          <Box>
            <Typography sx={{ color: "info.contrastText", fontSize: 19, lineHeight: 1.55 }}>
              Política de Retenção de Logs
            </Typography>
            <Typography
              sx={{
                color: "info.contrastText",
                fontSize: 16,
                lineHeight: 1.6,
                mt: 0.25,
                maxWidth: 1120,
              }}
            >
              Os logs de auditoria são armazenados por 90 dias. Após esse período,
              são arquivados automaticamente. Eventos críticos de segurança são
              mantidos permanentemente.
            </Typography>
            <Stack component="ul" spacing={0.35} sx={{ mt: 1.25, pl: 2.25, m: 0 }}>
              {RETENTION_ITEMS.map((item) => (
                <Typography
                  key={item}
                  component="li"
                  sx={{ color: "info.contrastText", fontSize: 14, lineHeight: 1.5 }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Card>

      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(4, minmax(0, 1fr))" }}
      >
        {(isLoadingStats
          ? Array.from({ length: 4 }, (_, index) => ({ id: index }))
          : summaryCards
        ).map((card, index) =>
          isLoadingStats ? (
            <Card key={index} sx={{ minHeight: 138, alignItems: "center", justifyContent: "center" }}>
              <CircularProgress size={24} />
            </Card>
          ) : (
            <SummaryCard
              key={(card as SummaryCardData).title}
              title={(card as SummaryCardData).title}
              value={(card as SummaryCardData).value}
              icon={(card as SummaryCardData).icon}
              iconBg={(card as SummaryCardData).iconBg}
            />
          ),
        )}
      </Box>

      <Card sx={{ p: 0, overflow: "hidden" }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2}
          sx={{ px: 3, py: 3 }}
          alignItems={{ xs: "stretch", lg: "center" }}
        >
          <Input
            placeholder="Buscar por usuário, ação, módulo ou IP..."
            icon={<SearchIcon />}
            value={filters.search}
            onChange={(event) =>
              updateFilters({ search: event.target.value })
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                height: 50,
              },
            }}
          />

          <FilterSelect
            value={filters.modulo}
            onChange={(value) =>
              updateFilters({ modulo: value })
            }
            options={moduleOptions}
            width={{ xs: "100%", lg: 258 }}
          />

          <FilterSelect
            value={filters.status}
            onChange={(value) =>
              updateFilters({ status: value })
            }
            options={STATUS_OPTIONS}
            width={{ xs: "100%", lg: 183 }}
          />
        </Stack>

        {error ? (
          <Box sx={{ px: 3, pb: 3 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : null}

        <Box sx={{ px: 3, py: 1.5, borderTop: "1px solid", borderColor: "grey.100" }}>
          <Typography sx={{ fontSize: 18, color: "text.secondary", lineHeight: 1.65 }}>
            {pagination?.total_results ?? rows.length} eventos encontrados
          </Typography>
        </Box>

        <Table
          columns={columns}
          rows={rows}
          isLoading={isLoading}
          getRowKey={(log) => log.id}
          remotePagination={{
            count: pagination?.total_results ?? 0,
            page: (pagination?.page ?? page) - 1,
            rowsPerPage,
            onPageChange: handlePageChange,
            onRowsPerPageChange: handleRowsPerPageChange,
          }}
        />
      </Card>

      <Dialog
        open={isDialogOpen && (isLoadingDetails || Boolean(detailsError))}
        onClose={closeDetails}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogContent sx={{ py: 5 }}>
          {isLoadingDetails ? (
            <Stack alignItems="center" spacing={2}>
              <CircularProgress size={28} />
              <Typography color="text.secondary">Carregando detalhes do log...</Typography>
            </Stack>
          ) : detailsError ? (
            <Alert severity="error">{detailsError}</Alert>
          ) : null}
        </DialogContent>
      </Dialog>

      <LogDetailsDialog
        log={selectedLog}
        open={isDialogOpen && Boolean(selectedLog) && !isLoadingDetails}
        onClose={closeDetails}
      />
    </Stack>
  );
}
