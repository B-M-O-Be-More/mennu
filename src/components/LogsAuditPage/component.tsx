"use client";

import React from "react";
import { Alert, Box, Button, CircularProgress, Dialog, DialogContent, Stack, Typography } from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PageHeader from "@/components/PageHeader";
import Card from "@/components/Cards/Card";
import Table from "@/components/Tables/Table";
import { DownloadIcon } from "@/components/Icons";
import { useDebounce } from "@/hooks/useDebounce/hook";
import { ILogAuditDetail, ILogAuditFilters, ILogAuditListItem, ILogAuditResponse, ILogAuditStats } from "@/Interfaces/LogAudit/logAudit";
import { getApiMessage } from "@/utils/apiMessage";
import { createLogAuditColumns } from "./columns";
import { LogAuditFilters as LogAuditFiltersBar } from "./LogAuditFilters";
import { LogAuditSummaryCards } from "./LogAuditSummaryCards";
import { LogDetailsDialog } from "./LogDetailsDialog";
import { LogsAuditPageProps } from "./interface";

const PAGE_SIZE = 5;
const STATUS_OPTIONS = [
  { label: "Todos os status", value: "all" },
  { label: "Sucesso", value: "sucesso" },
  { label: "Erro", value: "erro" },
  { label: "Aviso", value: "aviso" },
];
const DEFAULT_STATS: ILogAuditStats = { total_eventos: 0, total_sucessos: 0, total_erros: 0, total_avisos: 0 };
const RETENTION_ITEMS = [
  "Logins e logouts são registrados automaticamente",
  "Todas as alterações em permissões são auditadas",
  "Tentativas de acesso não autorizado geram alertas imediatos",
];

export default function LogsAuditPage({}: LogsAuditPageProps) {
  const [filters, setFilters] = React.useState<ILogAuditFilters>({ search: "", modulo: "all", status: "all" });
  const [logsResponse, setLogsResponse] = React.useState<ILogAuditResponse | null>(null);
  const [stats, setStats] = React.useState<ILogAuditStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isLoadingStats, setIsLoadingStats] = React.useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [detailsError, setDetailsError] = React.useState<string | null>(null);
  const [selectedLog, setSelectedLog] = React.useState<ILogAuditDetail | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(PAGE_SIZE);
  const logsRequestId = React.useRef(0);
  const statsRequestId = React.useRef(0);
  const detailsRequestId = React.useRef(0);
  const debouncedSearch = useDebounce(filters.search, 500);

  const loadLogs = React.useCallback(async (signal: AbortSignal) => {
    const requestId = ++logsRequestId.current;
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ page: String(page), page_size: String(rowsPerPage) });
      if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
      if (filters.modulo !== "all") params.set("modulo", filters.modulo);
      if (filters.status !== "all") params.set("status", filters.status);

      const response = await fetch(`/api/logs-auditoria?${params}`, { signal });
      if (!response.ok) throw new Error(getApiMessage(await response.json().catch(() => null), "Erro ao carregar logs"));

      const payload: ILogAuditResponse = await response.json();
      if (requestId === logsRequestId.current) setLogsResponse(payload);
    } catch (requestError) {
      if (!signal.aborted && requestId === logsRequestId.current) {
        setError(requestError instanceof Error ? requestError.message : "Erro ao carregar logs");
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

      const response = await fetch(`/api/logs-auditoria/stats?${params}`, { signal });
      if (!response.ok) throw new Error(getApiMessage(await response.json().catch(() => null), "Erro ao carregar estatísticas"));

      const payload: ILogAuditStats = await response.json();
      if (requestId === statsRequestId.current) setStats(payload);
    } catch {
      if (!signal.aborted && requestId === statsRequestId.current) setStats(DEFAULT_STATS);
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
    const modules = new Set((logsResponse?.results ?? []).map((log) => log.modulo).filter(Boolean));
    return [{ label: "Todos os módulos", value: "all" }, ...Array.from(modules).map((modulo) => ({ label: modulo, value: modulo }))];
  }, [logsResponse?.results]);

  const handleViewDetails = async (log: ILogAuditListItem) => {
    const requestId = ++detailsRequestId.current;
    setIsDialogOpen(true);
    setSelectedLog(null);
    setDetailsError(null);
    setIsLoadingDetails(true);

    try {
      const response = await fetch(`/api/logs-auditoria/${log.id}`);
      if (!response.ok) throw new Error(getApiMessage(await response.json().catch(() => null), "Erro ao carregar detalhes do log"));

      const payload: ILogAuditDetail = await response.json();
      if (requestId === detailsRequestId.current) setSelectedLog(payload);
    } catch (requestError) {
      if (requestId === detailsRequestId.current) setDetailsError(requestError instanceof Error ? requestError.message : "Erro ao carregar detalhes do log");
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
    window.open(query ? `/api/logs-auditoria/exportar?${query}` : "/api/logs-auditoria/exportar", "_blank", "noopener,noreferrer");
  };

  const rows = logsResponse?.results ?? [];
  const pagination = logsResponse?.metadados;

  return (
    <Stack gap={2.5}>
      <PageHeader title="Logs e Auditoria" subtitle="Registros de atividades e eventos do sistema">
        <Button variant="contained" startIcon={<DownloadIcon width={18} height={18} />} onClick={handleExport} sx={{ minWidth: 188, py: 1.6 }}>Exportar Logs</Button>
      </PageHeader>

      <Card sx={{ bgcolor: "info.main", borderColor: "info.light", p: 0, overflow: "hidden" }}>
        <Stack direction="row" spacing={2} sx={{ px: 3, py: 3 }}>
          <Box sx={{ pt: 0.25, color: "info.contrastText" }}><ShieldOutlinedIcon sx={{ fontSize: 25 }} /></Box>
          <Box>
            <Typography sx={{ color: "info.contrastText", fontSize: 19, lineHeight: 1.55 }}>Política de Retenção de Logs</Typography>
            <Typography sx={{ color: "info.contrastText", fontSize: 16, lineHeight: 1.6, mt: 0.25, maxWidth: 1120 }}>Os logs de auditoria são armazenados por 90 dias. Após esse período, são arquivados automaticamente. Eventos críticos de segurança são mantidos permanentemente.</Typography>
            <Stack component="ul" spacing={0.35} sx={{ mt: 1.25, pl: 2.25, m: 0 }}>
              {RETENTION_ITEMS.map((item) => <Typography key={item} component="li" sx={{ color: "info.contrastText", fontSize: 14, lineHeight: 1.5 }}>{item}</Typography>)}
            </Stack>
          </Box>
        </Stack>
      </Card>

      <LogAuditSummaryCards stats={stats} isLoading={isLoadingStats} />

      <Card sx={{ p: 0, overflow: "hidden" }}>
        <LogAuditFiltersBar filters={filters} moduleOptions={moduleOptions} statusOptions={STATUS_OPTIONS} onChange={updateFilters} />
        {error ? <Box sx={{ px: 3, pb: 3 }}><Alert severity="error">{error}</Alert></Box> : null}
        <Box sx={{ px: 3, py: 1.5, borderTop: "1px solid", borderColor: "grey.100" }}>
          <Typography sx={{ fontSize: 18, color: "text.secondary", lineHeight: 1.65 }}>{pagination?.total_results ?? rows.length} eventos encontrados</Typography>
        </Box>
        <Table
          columns={createLogAuditColumns(handleViewDetails)}
          rows={rows}
          isLoading={isLoading}
          getRowKey={(log) => log.id}
          remotePagination={{
            count: pagination?.total_results ?? 0,
            page: (pagination?.page ?? page) - 1,
            rowsPerPage,
            onPageChange: (nextPage) => setPage(nextPage + 1),
            onRowsPerPageChange: (nextRowsPerPage) => { setRowsPerPage(nextRowsPerPage); setPage(1); },
          }}
        />
      </Card>

      <Dialog open={isDialogOpen && (isLoadingDetails || Boolean(detailsError))} onClose={closeDetails} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogContent sx={{ py: 5 }}>
          {isLoadingDetails ? <Stack alignItems="center" spacing={2}><CircularProgress size={28} /><Typography color="text.secondary">Carregando detalhes do log...</Typography></Stack> : detailsError ? <Alert severity="error">{detailsError}</Alert> : null}
        </DialogContent>
      </Dialog>
      <LogDetailsDialog log={selectedLog} open={isDialogOpen && Boolean(selectedLog) && !isLoadingDetails} onClose={closeDetails} />
    </Stack>
  );
}
