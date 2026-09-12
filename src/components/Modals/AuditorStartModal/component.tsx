"use client";

import React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import Modal from "../Modal";
import { AuditorStartModalProps } from "./interface";
import { BuildingIcon, ClockIcon, PaperIcon, UsuariosIcon } from "@/components/Icons";
import { IStockAuditChecklist } from "@/Interfaces/StockAudit/stockAudit";
import { getApiMessage } from "@/utils/apiMessage";

/** Linha de contexto da auditoria: ícone, rótulo e valor. */
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Stack direction="row" alignItems="center" gap={1.5}>
      <Box display="flex" color="text.secondary">
        {icon}
      </Box>
      <Typography variant="body2" color="text.secondary" minWidth={72}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} color="text.primary">
        {value || "—"}
      </Typography>
    </Stack>
  );
}

export default function AuditorStartModal({
  open,
  onClose,
  audit,
}: AuditorStartModalProps) {
  const theme = useTheme();
  const router = useRouter();

  const [checklist, setChecklist] = React.useState<IStockAuditChecklist | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const auditId = audit?.id;

  React.useEffect(() => {
    if (!open || !auditId) return;

    let active = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/auditoria-estoque/${auditId}/checklist`,
        );
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(getApiMessage(payload, "Erro ao carregar a auditoria"));
        }

        if (active) setChecklist(payload as IStockAuditChecklist);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Erro ao carregar a auditoria",
        );
        setChecklist(null);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [open, auditId]);

  if (!audit) return null;

  // Pendentes é o que ainda falta conferir; num rascunho já começado o total
  // não diria ao auditor quanto trabalho resta.
  const itensParaConferir =
    checklist?.itens_pendentes ?? checklist?.total_itens ?? audit.total_itens ?? 0;

  const dataReferencia = checklist?.data_referencia ?? audit.data_referencia;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Auditoria de Estoque"
      subtitle="Conferência física"
    >
      <Stack gap={2.5}>
        {error && <Alert severity="error">{error}</Alert>}

        <Stack gap={1.5}>
          <InfoRow
            icon={<BuildingIcon width={18} height={18} />}
            label="Unidade"
            value={checklist?.unidade_nome ?? audit.unidade_nome}
          />
          <InfoRow
            icon={<ClockIcon width={18} height={18} />}
            label="Data"
            value={
              dataReferencia ? dayjs(dataReferencia).format("DD/MM/YYYY") : ""
            }
          />
          <InfoRow
            icon={<UsuariosIcon width={18} height={18} />}
            label="Auditor"
            value={checklist?.auditor_resp ?? audit.auditor_nome}
          />
        </Stack>

        <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
          Confira fisicamente cada item e informe a quantidade encontrada no
          local. Não consulte documentos ou sistemas — apenas o que está diante
          de você.
        </Alert>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={1.5}
          paddingY={2}
          borderRadius={2}
          bgcolor="background.default"
        >
          {isLoading ? (
            <CircularProgress size={22} />
          ) : (
            <React.Fragment>
              <PaperIcon
                width={22}
                height={22}
                color={theme.palette.text.secondary}
              />
              <Typography variant="h5" fontWeight={600}>
                {itensParaConferir}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                itens para conferir
              </Typography>
            </React.Fragment>
          )}
        </Stack>

        <Button
          variant="contained"
          fullWidth
          endIcon={<KeyboardArrowRight />}
          disabled={isLoading}
          onClick={() => {
            onClose();
            router.push(`/estoque/auditoria/${audit.id}/conferencia`);
          }}
          sx={{ paddingY: 1.5 }}
        >
          Começar conferência
        </Button>
      </Stack>
    </Modal>
  );
}
