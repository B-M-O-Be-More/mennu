"use client";

import React from "react";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import Can from "@/components/Can";
import Card from "@/components/Cards/Card";
import PageHeader from "@/components/PageHeader";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import TextArea from "@/components/FormControl/TextArea";
import Table from "@/components/Tables/Table";
import Toast from "@/components/Toast";
import ReadOnlyField from "@/components/ReadOnlyField";
import { FilterIcon, SearchIcon } from "@/components/Icons";
import { SelectOption } from "@/components/FormControl/Select/interface";
import { auditConferenceColumns, auditNormalizeColumns } from "@/data/tableColumns";
import { useDebounce } from "@/hooks/useDebounce/hook";
import { useToast } from "@/hooks/useToast/hook";
import {
  IStockAuditDetail,
  IStockAuditDetailItem,
  IStockAuditPhoto,
} from "@/Interfaces/StockAudit/stockAudit";
import {
  formatAuditQuantity,
  resolveAuditPhotoUrl,
  resolveStatus,
  toAuditNumber,
} from "@/utils/stockAuditUtils";
import { getApiMessage } from "@/utils/apiMessage";

const PHOTO_CARD_SIZE = 96;

const itemFilterOptions: SelectOption[] = [
  { label: "Todos", value: "all" },
  { label: "Divergentes", value: "divergentes" },
  { label: "Dentro da tolerância", value: "tolerancia" },
];

/** Linha do card "Resumos": valor à esquerda, descrição à direita. */
function SummaryRow({
  value,
  label,
  divider,
  highlight,
}: {
  value: React.ReactNode;
  label: string;
  divider: boolean;
  highlight?: boolean;
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
        <Typography
          variant="body2"
          color={highlight ? "error.contrastText" : "text.secondary"}
        >
          {label}
        </Typography>
      </Stack>
      {divider && <Divider sx={{ borderColor: "grey.100" }} />}
    </React.Fragment>
  );
}

export default function StockAuditNormalizePage() {
  return (
    <Can
      permissions="auditoriaestoque.normalizar.item"
      message="Você não tem permissão para normalizar auditorias de estoque."
    >
      <StockAuditNormalizePageContent />
    </Can>
  );
}

function StockAuditNormalizePageContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const auditId = params?.id;

  const { toast, showToast, closeToast } = useToast();

  const [audit, setAudit] = React.useState<IStockAuditDetail | null>(null);
  const [photos, setPhotos] = React.useState<IStockAuditPhoto[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isNormalizing, setIsNormalizing] = React.useState(false);
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  /** Quantidade final por item, digitada pelo usuário (chave = id do item). */
  const [adjusted, setAdjusted] = React.useState<Record<number, string>>({});

  const redirectTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  React.useEffect(
    () => () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    },
    [],
  );

  const { register, control, watch } = useForm<{
    itemSearch: string;
    tipo: string;
    motivo: string;
  }>({
    defaultValues: { itemSearch: "", tipo: "all", motivo: "" },
  });

  const filters = watch();
  const debouncedSearch = useDebounce(filters.itemSearch, 500);

  const loadAudit = React.useCallback(async () => {
    if (!auditId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/auditoria-estoque/${auditId}`);
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getApiMessage(payload, "Erro ao carregar a auditoria"));
      }

      const detail = payload as IStockAuditDetail;
      setAudit(detail);
      // A normalização assume o número do auditor; o campo já vem com ele e
      // só entra em `ajustes` o item cuja apuração conclui outra quantidade.
      setAdjusted(
        detail.itens.reduce<Record<number, string>>((acc, item) => {
          if (item.divergente) {
            const encontrada = toAuditNumber(item.quantidade_encontrada);
            acc[item.id] = encontrada !== null ? String(encontrada) : "";
          }
          return acc;
        }, {}),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar a auditoria");
      setAudit(null);
    } finally {
      setIsLoading(false);
    }
  }, [auditId]);

  const loadPhotos = React.useCallback(async () => {
    if (!auditId) return;

    try {
      const response = await fetch(`/api/auditoria-estoque/${auditId}/fotos`);
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getApiMessage(payload, "Erro ao carregar as fotos"));
      }

      setPhotos(Array.isArray(payload) ? (payload as IStockAuditPhoto[]) : []);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Erro ao carregar as fotos",
        "error",
      );
      setPhotos([]);
    }
  }, [auditId, showToast]);

  React.useEffect(() => {
    loadAudit();
  }, [loadAudit]);

  React.useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const items = React.useMemo(() => audit?.itens ?? [], [audit]);

  const visibleItems = React.useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();

    return items.filter((item) => {
      const matchesTerm =
        !term || item.insumo_nome.toLowerCase().includes(term);
      const matchesType =
        filters.tipo === "all" ||
        (filters.tipo === "divergentes" ? item.divergente : !item.divergente);

      return matchesTerm && matchesType;
    });
  }, [items, debouncedSearch, filters.tipo]);

  const divergentItems = React.useMemo(
    () => items.filter((item) => item.divergente),
    [items],
  );

  const itensConferidos = items.filter(
    (item) => toAuditNumber(item.quantidade_encontrada) !== null,
  ).length;
  const itensDivergentes = audit?.total_divergentes ?? divergentItems.length;
  const dentroTolerancia = Math.max(itensConferidos - itensDivergentes, 0);
  const qtdFotos = photos.length;

  const summaryRows = [
    { value: itensConferidos, label: "Itens conferidos" },
    { value: itensDivergentes, label: "Divergentes", highlight: true },
    { value: dentroTolerancia, label: "Dentro da tolerância" },
    { value: qtdFotos, label: "Fotos adicionadas" },
  ];

  const handleAdjustedChange = (itemId: number, value: string) => {
    setAdjusted((prev) => ({ ...prev, [itemId]: value }));
  };

  const normalizeColumns = auditNormalizeColumns.map((col) => {
    if (col.key === "apos_normalizacao") {
      return {
        ...col,
        render: (row: IStockAuditDetailItem) => (
          <OutlinedInput
            size="small"
            value={adjusted[row.id] ?? ""}
            onChange={(event) => handleAdjustedChange(row.id, event.target.value)}
            inputProps={{
              inputMode: "decimal",
              style: { textAlign: "center" },
              "aria-label": `Quantidade após normalização de ${row.insumo_nome}`,
            }}
            endAdornment={
              <Typography variant="caption" color="text.secondary">
                {(row.unidade_medida ?? "").toUpperCase()}
              </Typography>
            }
            sx={{ borderRadius: 2, maxWidth: 140 }}
          />
        ),
      };
    }

    if (col.key === "ajuste") {
      return {
        ...col,
        render: (row: IStockAuditDetailItem) => {
          const parsed = toAuditNumber(adjusted[row.id]);
          const encontrado = toAuditNumber(row.quantidade_encontrada);

          if (parsed === null || encontrado === null) {
            return <Typography variant="body2">—</Typography>;
          }

          const delta = parsed - encontrado;
          if (delta === 0) return <Typography variant="body2">—</Typography>;

          return (
            <Chip
              label={formatAuditQuantity(delta, row.unidade_medida, {
                signed: true,
              })}
              color={delta > 0 ? "success" : "error"}
              size="small"
            />
          );
        },
      };
    }

    return col;
  });

  /** Itens em que o usuário concluiu uma quantidade diferente da apurada. */
  const ajustes = divergentItems.reduce<
    { item_id: number; quantidade: number }[]
  >((acc, item) => {
    const quantidade = toAuditNumber(adjusted[item.id]);
    const encontrada = toAuditNumber(item.quantidade_encontrada);

    if (quantidade !== null && quantidade !== encontrada) {
      acc.push({ item_id: item.id, quantidade });
    }

    return acc;
  }, []);

  const handleNormalize = async () => {
    if (!auditId) return;

    const motivo = filters.motivo.trim();
    if (!motivo) {
      showToast("Informe o motivo da normalização", "warning");
      return;
    }

    setIsNormalizing(true);

    try {
      const response = await fetch(
        `/api/auditoria-estoque/${auditId}/normalizar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ motivo, ajustes }),
        },
      );
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getApiMessage(payload, "Erro ao normalizar o estoque"));
      }

      showToast(getApiMessage(payload, "Estoque normalizado"), "success");

      // Volta para a listagem de auditorias; o intervalo dá tempo de o toast
      // ser lido antes da navegação desmontar a tela.
      setIsRedirecting(true);
      redirectTimerRef.current = setTimeout(() => {
        router.push("/estoque?tab=auditoria");
      }, 1200);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Erro ao normalizar o estoque",
        "error",
      );
    } finally {
      setIsNormalizing(false);
    }
  };

  const statusChip = resolveStatus(audit?.status);
  const isNormalized = Boolean(audit?.normalizada_em);

  if (isLoading) {
    return (
      <Stack alignItems="center" paddingY={8}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack gap={2}>
      <PageHeader
        title="Detalhes da Auditoria - Normalizar"
        subtitle="Revise a conferência do auditor e ajuste o estoque do sistema"
      >
        <Chip label={statusChip.label} color={statusChip.color} size="small" />
      </PageHeader>

      {error && <Alert severity="error">{error}</Alert>}

      {itensDivergentes > 0 && (
        <Alert severity="warning" variant="outlined">
          <AlertTitle sx={{ fontSize: "0.875rem", marginBottom: 0 }}>
            Estoque com divergência
          </AlertTitle>
          {itensDivergentes === 1
            ? "Foi encontrado 1 item fora da margem de tolerância."
            : `Foram encontrados ${itensDivergentes} itens fora da margem de tolerância.`}
        </Alert>
      )}

      <Card>
        <ReadOnlyField label="Auditoria" value={audit?.unidade_nome} />

        <Stack direction="row" gap={2}>
          <ReadOnlyField
            label="Auditor Responsavel"
            value={audit?.auditor_nome}
          />
          <ReadOnlyField
            label="Data da Visita"
            value={
              audit?.data_referencia
                ? dayjs(audit.data_referencia).format("DD/MM/YYYY")
                : ""
            }
          />
        </Stack>

        <ReadOnlyField
          label="Observações"
          align="left"
          value={audit?.observacao_geral || "Sem observações do auditor"}
        />

        <Stack direction="row" gap={2}>
          <Input
            placeholder="Buscar por..."
            icon={<SearchIcon />}
            register={register("itemSearch")}
          />

          <Select
            options={itemFilterOptions}
            name="tipo"
            control={control}
            formControlSx={{ maxWidth: "220px" }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{ fontWeight: "400", minWidth: "120px" }}
            onClick={() => loadAudit()}
          >
            Filtrar
          </Button>
        </Stack>

        <Stack direction={{ xs: "column", lg: "row" }} gap={2} alignItems="stretch">
          <Card sx={{ flex: 2 }}>
            <Typography variant="h6" fontWeight={400}>
              Resultado da conferência
            </Typography>

            <Table
              columns={auditConferenceColumns}
              rows={visibleItems}
              initialRowsPerPage={10}
            />
          </Card>

          <Card sx={{ flex: 1, height: "fit-content" }}>
            <Typography variant="h6" fontWeight={400}>
              Resumos
            </Typography>

            <Box>
              {summaryRows.map((row, index) => (
                <SummaryRow
                  key={row.label}
                  value={row.value}
                  label={row.label}
                  highlight={row.highlight}
                  divider={index < summaryRows.length - 1}
                />
              ))}
            </Box>
          </Card>
        </Stack>

        <Card>
          <Typography variant="h6" fontWeight={400}>
            Fotos
          </Typography>

          <Stack direction="row" gap={2} flexWrap="wrap">
            {photos.map((photo, index) => (
              <Box key={photo.id}>
                <Typography variant="caption" color="text.secondary">
                  Foto {index + 1}
                </Typography>
                <Box
                  component="img"
                  src={resolveAuditPhotoUrl(photo.url)}
                  alt={`Foto ${index + 1} da auditoria`}
                  sx={{
                    display: "block",
                    width: PHOTO_CARD_SIZE,
                    height: PHOTO_CARD_SIZE,
                    objectFit: "cover",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                />
              </Box>
            ))}

            {photos.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Nenhuma foto adicionada pelo auditor.
              </Typography>
            )}
          </Stack>
        </Card>

        <Card>
          <Typography variant="h6" fontWeight={400}>
            Normalizar Estoque
          </Typography>

          <Table
            columns={normalizeColumns}
            rows={divergentItems}
            initialRowsPerPage={10}
          />

          <TextArea
            label="Motivo da Normalização"
            placeholder="Informe o motivo do ajuste..."
            rows={3}
            register={register("motivo")}
          />
        </Card>

        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            sx={{ flex: 1 }}
            onClick={() => router.push("/estoque?tab=auditoria")}
            disabled={isNormalizing || isRedirecting}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            sx={{ flex: 1 }}
            onClick={handleNormalize}
            disabled={isNormalizing || isRedirecting || isNormalized}
          >
            {isNormalizing || isRedirecting
              ? "Normalizando..."
              : isNormalized
                ? "Estoque normalizado"
                : "Normalizar estoque"}
          </Button>
        </Stack>
      </Card>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        autoHideDuration={toast.duration}
        onClose={closeToast}
      />
    </Stack>
  );
}
