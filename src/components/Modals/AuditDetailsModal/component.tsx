"use client";

import React from "react";
import {
  Alert,
  AlertTitle,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Modal from "../Modal";
import Card from "@/components/Cards/Card";
import ReadOnlyField from "@/components/ReadOnlyField";
import { AuditDetailsModalProps } from "./interface";
import { IStockAuditChecklist } from "@/Interfaces/StockAudit/stockAudit";
import { resolveStatus, toStatusKey } from "@/utils/stockAuditUtils";
import dayjs from "dayjs";
import { getApiMessage } from "@/utils/apiMessage";

/** Linha do card "Resumos": valor à esquerda, descrição à direita. */
function SummaryRow({
  value,
  label,
  divider,
}: {
  value: React.ReactNode;
  label: string;
  divider: boolean;
}) {
  return (
    <React.Fragment>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        paddingY={1.5}
      >
        <Typography variant="body1" color="text.primary">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Stack>
      {divider && <Divider sx={{ borderColor: "grey.100" }} />}
    </React.Fragment>
  );
}

export default function AuditDetailsModal({
  open,
  onClose,
  audit,
}: AuditDetailsModalProps) {
  const router = useRouter();

  const [checklist, setChecklist] = React.useState<IStockAuditChecklist | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const auditId = audit?.id;
  const statusKey = toStatusKey(audit?.status);
  const isInProgress = statusKey === "rascunho";
  // Divergência já apurada: muda o alerta, o resumo e as ações do rodapé — os
  // números continuam vindo do mesmo checklist.
  const hasDivergence = statusKey === "com_divergencia";

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

  const status = checklist?.status ?? audit.status;
  // No design o rascunho aparece como "Em andamento" — é o mesmo estado que os
  // cards do painel contam sob esse rótulo.
  const statusChip = isInProgress
    ? { label: "Em andamento", color: "warning" as const }
    : resolveStatus(status);

  const totalItens = checklist?.total_itens ?? audit.total_itens ?? 0;
  const itensConferidos = checklist?.itens_conferidos ?? 0;
  const itensDivergentes = checklist?.itens_divergentes ?? 0;
  const qtdFotos = checklist?.qtd_fotos ?? 0;

  const dataReferencia = checklist?.data_referencia ?? audit.data_referencia;

  const summaryRows = hasDivergence
    ? [
      { value: itensConferidos, label: "Itens conferidos" },
      { value: itensDivergentes, label: "Divergentes" },
      {
        value: Math.max(itensConferidos - itensDivergentes, 0),
        label: "Dentro da tolerância",
      },
      { value: qtdFotos, label: "Fotos adicionadas" },
    ]
    : [
      { value: itensConferidos, label: "Itens conferidos" },
      {
        value: Math.max(totalItens - itensConferidos, 0),
        label: "Itens Faltantes",
      },
      { value: qtdFotos, label: "Fotos adicionadas" },
      { value: itensDivergentes, label: "Itens divergentes" },
    ];

  const handleNormalize = () => {
    onClose();
    router.push(`/estoque/auditoria/${audit.id}/normalizar`);
  };

  return (
    <Modal open={open} onClose={onClose} title="Detalhes da Auditoria">
      <Stack gap={2}>
        {error && <Alert severity="error">{error}</Alert>}

        {isInProgress && (
          <Alert severity="warning" variant="outlined">
            <AlertTitle sx={{ fontSize: "0.875rem", marginBottom: 0 }}>
              Auditoria ainda está em andamento
            </AlertTitle>
            Aguarde, o auditor está realizando a auditoria do estoque atual
          </Alert>
        )}

        {hasDivergence && (
          <Alert severity="warning" variant="outlined">
            <AlertTitle sx={{ fontSize: "0.875rem", marginBottom: 0 }}>
              Estoque com divergência
            </AlertTitle>
            {itensDivergentes === 1
              ? "Foi encontrado 1 item fora da margem de tolerância."
              : `Foram encontrados ${itensDivergentes} itens fora da margem de tolerância.`}
          </Alert>
        )}

        {isLoading ? (
          <Stack alignItems="center" paddingY={6}>
            <CircularProgress />
          </Stack>
        ) : (
          <React.Fragment>
            <ReadOnlyField
              label="Auditoria"
              value={checklist?.unidade_nome ?? audit.unidade_nome}
            />

            <Stack direction="row" gap={2}>
              <ReadOnlyField
                label="Auditor Responsavel"
                value={checklist?.auditor_resp ?? audit.auditor_nome}
              />
              <ReadOnlyField
                label="Data da Visita"
                value={
                  // `data_referencia` vem só com a data ("2026-09-03"): dayjs
                  // interpreta no fuso local, `new Date` leria como UTC e
                  // voltaria um dia em fusos negativos.
                  dataReferencia ? dayjs(dataReferencia).format("DD/MM/YYYY") : ""
                }
              />
            </Stack>

            <Card variant="compact" sx={{ padding: 2, maxWidth: "100%" }}>
              <Typography variant="h6" fontWeight={400} mb={1}>
                Resumos
              </Typography>

              {summaryRows.map((row, index) => (
                <SummaryRow
                  key={row.label}
                  value={row.value}
                  label={row.label}
                  divider={index < summaryRows.length - 1}
                />
              ))}
            </Card>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
            >
              <Typography variant="body2" color="text.label">
                Itens do Checklist: {totalItens}
              </Typography>

              <Chip
                label={statusChip.label}
                color={statusChip.color}
                size="small"
              />
            </Stack>
          </React.Fragment>
        )}

        {hasDivergence ? (
          <Stack direction="row" gap={2}>
            <Button variant="outlined" sx={{ flex: 1 }} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              sx={{ flex: 1 }}
              onClick={handleNormalize}
              disabled={isLoading}
            >
              Normalizar Estoque
            </Button>
          </Stack>
        ) : (
          <Button variant="outlined" onClick={onClose} fullWidth>
            Voltar
          </Button>
        )}
      </Stack>
    </Modal>
  );
}
