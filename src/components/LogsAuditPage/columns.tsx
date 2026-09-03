import { Button, Chip, Stack, Typography } from "@mui/material";
import Table, { IColumn } from "@/components/Tables/Table";
import { EyeIcon } from "@/components/Icons";
import { ILogAuditListItem } from "@/Interfaces/LogAudit/logAudit";
import { formatLogAuditDateTime } from "@/utils/logAuditUtils";
import { getLogAuditStatusConfig } from "./status";

export function createLogAuditColumns(onViewDetails: (log: ILogAuditListItem) => void): IColumn<ILogAuditListItem>[] {
  return [
    { key: "criado_em", label: "Timestamp", render: (log) => formatLogAuditDateTime(log.criado_em) },
    {
      key: "usuario_email",
      label: "Usuário",
      render: (log) => <Stack spacing={0.25}><Typography variant="body2">{log.usuario_email}</Typography><Typography variant="caption" color="text.secondary">Log #{log.id}</Typography></Stack>,
    },
    { key: "acao", label: "Ação" },
    { key: "modulo", label: "Módulo", render: (log) => <Chip label={log.modulo} variant="outlined" size="small" sx={{ bgcolor: "grey.100", border: "none", color: "text.secondary" }} /> },
    { key: "ip_address", label: "IP", render: (log) => log.ip_address || "-" },
    {
      key: "status",
      label: "Status",
      render: (log) => {
        const status = getLogAuditStatusConfig(log.status);
        return <Stack direction="row" spacing={1} alignItems="center">{status.icon}<Chip label={status.label} variant="outlined" size="small" sx={{ ...status.chipSx, textTransform: "capitalize" }} /></Stack>;
      },
    },
    { key: "details", label: "Ação", render: (log) => <Button variant="text" startIcon={<EyeIcon width={14} height={14} color="#FF3D00" />} onClick={() => onViewDetails(log)} sx={{ color: "primary.main", px: 0, minWidth: 0 }}>Ver detalhes</Button> },
  ];
}
