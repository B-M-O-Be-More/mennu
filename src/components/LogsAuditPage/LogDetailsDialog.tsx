import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { ILogAuditDetail } from "@/Interfaces/LogAudit/logAudit";
import { getLogAuditDetailFields, getLogAuditDetailMessage } from "@/utils/logAuditUtils";
import { getLogAuditStatusConfig } from "./status";

const detailIcons = {
  Timestamp: <AccessTimeRoundedIcon sx={{ fontSize: 16, color: "#98A2B3" }} />,
  "Usuário": <PersonOutlineRoundedIcon sx={{ fontSize: 16, color: "#98A2B3" }} />,
  Perfil: <ShieldOutlinedIcon sx={{ fontSize: 16, color: "#98A2B3" }} />,
  "Módulo": <LayersOutlinedIcon sx={{ fontSize: 16, color: "#98A2B3" }} />,
  "Endereço IP": <PublicRoundedIcon sx={{ fontSize: 16, color: "#98A2B3" }} />,
  "Tempo de Resposta": <AccessTimeRoundedIcon sx={{ fontSize: 16, color: "#98A2B3" }} />,
  "User Agent": <InfoOutlinedIcon sx={{ fontSize: 16, color: "#98A2B3" }} />,
};

export function LogDetailsDialog({ log, open, onClose }: { log: ILogAuditDetail | null; open: boolean; onClose: () => void }) {
  if (!log) return null;

  const statusConfig = getLogAuditStatusConfig(log.status);
  const detailFields = getLogAuditDetailFields(log);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" slotProps={{ paper: { sx: { borderRadius: 3, maxWidth: 710, boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)" } } }}>
      <DialogTitle sx={{ px: 4, py: 3, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid", borderColor: "grey.100" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: statusConfig.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>{statusConfig.statIcon}</Box>
          <Box>
            <Typography sx={{ fontSize: 32, lineHeight: 1.4, fontWeight: 600 }}>Detalhes do Log</Typography>
            <Typography sx={{ fontSize: 18, color: "text.secondary", lineHeight: 1.5 }}>ID #{log.id}</Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} sx={{ color: "#667085" }}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 4, py: 3 }}>
        <Box sx={{ border: "1px solid", borderRadius: 2.5, px: 2.5, py: 2, display: "flex", gap: 1.5, alignItems: "center", ...statusConfig.bannerSx }}>
          {statusConfig.icon}
          <Stack spacing={0.25}>
            <Typography sx={{ fontSize: 18, lineHeight: 1.6, color: statusConfig.headingColor }}>{log.acao}</Typography>
            <Typography sx={{ fontSize: 18, lineHeight: 1.6, color: statusConfig.bodyColor }}>{getLogAuditDetailMessage(log)}</Typography>
          </Stack>
        </Box>

        <Box sx={{ mt: 3, display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" } }}>
          {detailFields.map((field) => (
            <Box key={field.label} sx={{ gridColumn: field.fullWidth ? { xs: "span 1", md: "span 2" } : "auto", bgcolor: "background.default", borderRadius: 2.5, px: 2, py: 1.5 }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={0.75}>
                {detailIcons[field.label as keyof typeof detailIcons]}
                <Typography sx={{ fontSize: 12, lineHeight: 1.35, letterSpacing: "0.025em", color: "#98A2B3", textTransform: "uppercase" }}>{field.label}</Typography>
              </Stack>
              <Typography sx={{ fontSize: 18, lineHeight: 1.6, color: "text.primary" }}>{field.value}</Typography>
            </Box>
          ))}
        </Box>

        <Stack direction="row" justifyContent="flex-end" mt={3}>
          <Button variant="outlined" onClick={onClose} sx={{ bgcolor: "grey.100", color: "text.label", outline: "none", minWidth: 101, "&:hover": { bgcolor: "grey.200" } }}>Fechar</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
