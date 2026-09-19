"use client";

import React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Chip,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  LinearProgress,
  OutlinedInput,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import CloseIcon from "@mui/icons-material/Close";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";
import Card from "@/components/Cards/Card";
import Toast from "@/components/Toast";
import SendAuditModal from "@/components/Modals/SendAuditModal";
import {
  CircledCheckIcon,
  ImageIcon,
  PlusIcon,
  SearchIcon,
} from "@/components/Icons";
import { useToast } from "@/hooks/useToast/hook";
import Can from "@/components/Can";
import {
  IStockAuditDetail,
  IStockAuditDetailItem,
  IStockAuditPhoto,
} from "@/Interfaces/StockAudit/stockAudit";
import {
  formatAuditQuantity,
  formatAuditQuantityInput,
  isIntegerAuditUnit,
  maskAuditQuantity,
  resolveAuditPhotoUrl,
  toAuditNumber,
} from "@/utils/stockAuditUtils";
import { getApiMessage } from "@/utils/apiMessage";

const PHOTO_CARD_SIZE = 88;

type ListFilter = "todos" | "pendentes" | "conferidos";

/**
 * Quantidade conferida na lista lateral, sem unidade. Acompanha a precisão do
 * campo para não exibir um número diferente do que o auditor digitou.
 */
function formatListQuantity(value: number, unidadeMedida?: string | null): string {
  const decimals = isIntegerAuditUnit(unidadeMedida) ? 0 : 2;

  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Rótulo de campo no mesmo tom dos formulários do projeto. */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="body2" color="text.label" mb={1}>
      {children}
    </Typography>
  );
}

/** Rótulo em caixa alta da conferência, como no design. */
function SectionLabel({
  children,
  align = "center",
}: {
  children: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <Typography
      variant="caption"
      component="p"
      color="text.secondary"
      textAlign={align}
      textTransform="uppercase"
      letterSpacing={1}
      marginBottom={1}
    >
      {children}
    </Typography>
  );
}

/** Linha do "Resumo antes do envio": rótulo à esquerda, valor à direita. */
function SummaryRow({
  label,
  value,
  divider,
}: {
  label: string;
  value: React.ReactNode;
  divider: boolean;
}) {
  return (
    <React.Fragment>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        paddingY={1.25}
      >
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={600} color="text.primary">
          {value}
        </Typography>
      </Stack>
      {divider && <Divider sx={{ borderColor: "grey.100" }} />}
    </React.Fragment>
  );
}

function PhotoThumb({ photo, index }: { photo: IStockAuditPhoto; index: number }) {
  return (
    <Box
      component="img"
      src={resolveAuditPhotoUrl(photo.url)}
      alt={`Foto ${index + 1} da conferência`}
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
  );
}

export default function StockAuditConferencePage() {
  return (
    <Can
      permissions="auditoriaestoque.submit.item"
      message="Você não tem permissão para conferir auditorias de estoque."
    >
      <StockAuditConferencePageContent />
    </Can>
  );
}

function StockAuditConferencePageContent() {
  const theme = useTheme();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const auditId = params?.id;

  const { toast, showToast, closeToast } = useToast();

  const [audit, setAudit] = React.useState<IStockAuditDetail | null>(null);
  const [photos, setPhotos] = React.useState<IStockAuditPhoto[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [index, setIndex] = React.useState(0);
  const [quantidade, setQuantidade] = React.useState("");
  const [observacao, setObservacao] = React.useState("");
  const [observacaoGeral, setObservacaoGeral] = React.useState("");

  const [isSaving, setIsSaving] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [view, setView] = React.useState<"itens" | "resumo" | "enviada">(
    "itens",
  );
  const [isSendOpen, setIsSendOpen] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [isListOpen, setIsListOpen] = React.useState(false);
  const [listFilter, setListFilter] = React.useState<ListFilter>("todos");
  const [listSearch, setListSearch] = React.useState("");

  const itemFileRef = React.useRef<HTMLInputElement | null>(null);
  const generalFileRef = React.useRef<HTMLInputElement | null>(null);

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
      setObservacaoGeral(detail.observacao_geral ?? "");

      // Retoma de onde parou: primeiro item ainda sem quantidade.
      const firstPending = detail.itens.findIndex(
        (item) => toAuditNumber(item.quantidade_encontrada) === null,
      );
      setIndex(firstPending >= 0 ? firstPending : 0);
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
  const currentItem: IStockAuditDetailItem | undefined = items[index];
  const currentItemId = currentItem?.id;

  // Cada item traz de volta o que já foi conferido — inclusive ao voltar.
  React.useEffect(() => {
    const item = items.find((candidate) => candidate.id === currentItemId);
    if (!item) return;

    const quantidadeSalva = toAuditNumber(item.quantidade_encontrada);
    setQuantidade(
      quantidadeSalva !== null
        ? formatAuditQuantityInput(quantidadeSalva, item.unidade_medida)
        : "",
    );
    setObservacao(item.observacao ?? "");
  }, [currentItemId, items]);

  const itemPhotos = photos.filter((photo) => photo.item_id === currentItemId);
  const generalPhotos = photos.filter((photo) => photo.item_id === null);
  const itemPhotosCount = photos.filter((photo) => photo.item_id !== null).length;

  const conferidos = items.filter(
    (item) => toAuditNumber(item.quantidade_encontrada) !== null,
  ).length;
  const pendentes = Math.max(items.length - conferidos, 0);
  const isLastItem = index >= items.length - 1;

  const progress = items.length
    ? Math.round((conferidos / items.length) * 100)
    : 0;

  const listFilters: { value: ListFilter; label: string }[] = [
    { value: "todos", label: "Todos" },
    { value: "pendentes", label: `Pendentes (${pendentes})` },
    { value: "conferidos", label: `Conferidos (${conferidos})` },
  ];

  const listItems = items.filter((item) => {
    const term = listSearch.trim().toLowerCase();
    const matchesTerm = !term || item.insumo_nome.toLowerCase().includes(term);
    const conferido = toAuditNumber(item.quantidade_encontrada) !== null;

    const matchesFilter =
      listFilter === "todos" ||
      (listFilter === "conferidos" ? conferido : !conferido);

    return matchesTerm && matchesFilter;
  });

  // Mesma convenção de sinal do detalhe da API: teórico menos encontrado.
  const quantidadeTeorica = toAuditNumber(currentItem?.quantidade_teorica);
  const quantidadeDigitada = toAuditNumber(quantidade);
  const divergenciaAtual =
    quantidadeTeorica !== null && quantidadeDigitada !== null
      ? quantidadeTeorica - quantidadeDigitada
      : null;

  const goToItem = (itemId: number) => {
    const target = items.findIndex((item) => item.id === itemId);
    if (target >= 0) setIndex(target);
    setIsListOpen(false);
  };

  /** Grava o item atual e reflete a resposta na lista carregada. */
  const saveCurrentItem = async (): Promise<boolean> => {
    if (!auditId || !currentItem) return false;

    const parsed = toAuditNumber(quantidade);
    if (parsed === null || parsed < 0) {
      showToast("Informe a quantidade encontrada", "warning");
      return false;
    }

    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/auditoria-estoque/${auditId}/itens/${currentItem.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // A API trabalha os decimais como string ("371.00"); mandar o
            // número cru perderia o zero à direita de "1.250".
            quantidade_encontrada: formatAuditQuantityInput(
              parsed,
              currentItem.unidade_medida,
            ),
            observacao: observacao.trim(),
          }),
        },
      );
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getApiMessage(payload, "Erro ao salvar o item"));
      }

      setAudit((prev) =>
        prev
          ? {
            ...prev,
            itens: prev.itens.map((item) =>
              item.id === currentItem.id
                ? {
                  ...item,
                  quantidade_encontrada: parsed,
                  observacao: observacao.trim(),
                }
                : item,
            ),
          }
          : prev,
      );

      return true;
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Erro ao salvar o item",
        "error",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    const saved = await saveCurrentItem();
    if (!saved) return;

    if (isLastItem) {
      setView("resumo");
      return;
    }

    setIndex((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (index === 0) return;
    setIndex((prev) => prev - 1);
  };

  const handleSendAudit = async () => {
    if (!auditId) return;

    setIsSending(true);

    try {
      const response = await fetch(`/api/auditoria-estoque/${auditId}/enviar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getApiMessage(payload, "Erro ao enviar a auditoria"));
      }

      setIsSendOpen(false);
      setView("enviada");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Erro ao enviar a auditoria",
        "error",
      );
    } finally {
      setIsSending(false);
    }
  };

  const uploadPhoto = async (file: File, itemId?: number) => {
    if (!auditId) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("arquivo", file);
      if (itemId !== undefined) formData.append("item_id", String(itemId));

      const response = await fetch(`/api/auditoria-estoque/${auditId}/fotos`, {
        method: "POST",
        body: formData,
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getApiMessage(payload, "Erro ao enviar a foto"));
      }

      showToast(getApiMessage(payload, "Foto adicionada"), "success");
      await loadPhotos();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Erro ao enviar a foto",
        "error",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    itemId?: number,
  ) => {
    const file = event.target.files?.[0];
    // Zera o input para o mesmo arquivo poder ser escolhido de novo.
    event.target.value = "";
    if (file) uploadPhoto(file, itemId);
  };

  const addPhotoButton = (onClick: () => void) => (
    <Box>
      <Box
        component="button"
        type="button"
        onClick={onClick}
        disabled={isUploading}
        aria-label="Adicionar foto"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          width: PHOTO_CARD_SIZE,
          height: PHOTO_CARD_SIZE,
          border: "1px dashed",
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: "background.paper",
          cursor: isUploading ? "default" : "pointer",
          color: "text.secondary",
        }}
      >
        {isUploading ? (
          <CircularProgress size={18} />
        ) : (
          <React.Fragment>
            <PlusIcon width={18} height={18} />
            <Typography variant="caption" color="text.secondary">
              Foto
            </Typography>
          </React.Fragment>
        )}
      </Box>
    </Box>
  );

  if (isLoading) {
    return (
      <Stack alignItems="center" paddingY={8}>
        <CircularProgress />
      </Stack>
    );
  }

  if (view === "enviada") {
    return (
      <Stack alignItems="center" paddingY={6}>
        <Stack width="100%" maxWidth={480} gap={3} alignItems="center">
          <Box
            sx={{
              display: "flex",
              padding: 2.5,
              borderRadius: "50%",
              bgcolor: "success.main",
            }}
          >
            <CircledCheckIcon
              width={48}
              height={48}
              color={theme.palette.success.contrastText}
            />
          </Box>

          <Box textAlign="center">
            <Typography variant="h4" fontWeight={600}>
              Auditoria enviada
            </Typography>
            <Typography variant="body1" color="text.secondary">
              A conferência da{" "}
              <Typography component="span" variant="body1" fontWeight={600}>
                {audit?.unidade_nome ?? "unidade"}
              </Typography>{" "}
              foi registrada com sucesso.
            </Typography>
          </Box>

          <Card sx={{ width: "100%" }}>
            <Box>
              <SummaryRow
                label="Data"
                value={
                  audit?.data_referencia
                    ? dayjs(audit.data_referencia).format("DD/MM/YYYY")
                    : "—"
                }
                divider
              />
              <SummaryRow label="Itens conferidos" value={conferidos} divider />
              <SummaryRow
                label="Total de fotos"
                value={photos.length}
                divider={false}
              />
            </Box>
          </Card>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            O resultado da conferência será analisado pela gestão.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={() => router.push("/estoque?tab=auditoria")}
            sx={{ paddingY: 1.5 }}
          >
            Voltar para minhas auditorias
          </Button>
        </Stack>
      </Stack>
    );
  }

  if (view === "resumo") {
    return (
      <Stack gap={2}>
        <Box>
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => setView("itens")}
            sx={{ color: "text.secondary" }}
          >
            Voltar à conferência
          </Button>
        </Box>

        <Card
          alignItems="center"
          gap={1}
          sx={{
            bgcolor: "success.main",
            border: "1px solid",
            borderColor: "success.light",
            paddingY: 4,
          }}
        >
          <CircledCheckIcon
            width={40}
            height={40}
            color={theme.palette.success.contrastText}
          />
          <Typography variant="h5" fontWeight={600}>
            {pendentes === 0 ? "Conferência concluída" : "Conferência em andamento"}
          </Typography>
          <Typography
            variant="h6"
            fontWeight={600}
            color={theme.palette.success.contrastText}
          >
            {conferidos} / {items.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            itens conferidos
          </Typography>
        </Card>

        <Card>
          <Typography variant="h6" fontWeight={400}>
            Resumo antes do envio
          </Typography>

          <Box>
            <SummaryRow label="Itens conferidos" value={conferidos} divider />
            <SummaryRow label="Itens pendentes" value={pendentes} divider />
            <SummaryRow label="Fotos dos itens" value={itemPhotosCount} divider />
            <SummaryRow
              label="Fotos gerais"
              value={generalPhotos.length}
              divider={false}
            />
          </Box>
        </Card>

        <Card>
          <Typography variant="h6" fontWeight={400}>
            Registro da despensa
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Adicione fotos gerais do local para documentar a conferência.
          </Typography>

          <Stack direction="row" gap={2} flexWrap="wrap">
            {generalPhotos.map((photo, photoIndex) => (
              <PhotoThumb key={photo.id} photo={photo} index={photoIndex} />
            ))}

            {addPhotoButton(() => generalFileRef.current?.click())}
          </Stack>

          <Typography variant="caption" color="text.secondary">
            Sugestões: visão geral da despensa, prateleiras, freezers, armários
          </Typography>

          <input
            ref={generalFileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => handleFileChange(event)}
          />
        </Card>

        <Card>
          <FieldLabel>Observação geral</FieldLabel>
          <OutlinedInput
            multiline
            minRows={3}
            fullWidth
            value={observacaoGeral}
            onChange={(event) => setObservacaoGeral(event.target.value)}
            sx={{ borderRadius: 2, fontSize: 14 }}
          />
        </Card>

        <Button
          variant="contained"
          fullWidth
          startIcon={<SendOutlinedIcon />}
          onClick={() => setIsSendOpen(true)}
          disabled={isSending}
          sx={{ paddingY: 1.5 }}
        >
          Enviar auditoria
        </Button>

        <SendAuditModal
          open={isSendOpen}
          onCancel={() => setIsSendOpen(false)}
          onConfirm={handleSendAudit}
          itensConferidos={conferidos}
          totalFotos={photos.length}
          isSending={isSending}
        />

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

  return (
    // minHeight garante que o rodapé fique colado embaixo mesmo com o item
    // curto — é ele que sustenta o `marginTop: auto` da barra de ações.
    <Stack gap={2} minHeight="100%">
      <Card sx={{ paddingY: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Stack direction="row" alignItems="center" gap={0.5} minWidth={0}>
            <IconButton
              aria-label="Voltar para as auditorias"
              onClick={() => router.push("/estoque?tab=auditoria")}
              sx={{ color: "text.secondary" }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Typography variant="h6" fontWeight={600} noWrap>
              {audit?.unidade_nome ?? "Auditoria"}
            </Typography>
          </Stack>

          <Button
            variant="text"
            startIcon={<FormatListBulletedIcon />}
            onClick={() => setIsListOpen(true)}
            sx={{
              bgcolor: "background.default",
              color: "text.secondary",
              paddingX: 2,
              whiteSpace: "nowrap",
            }}
          >
            Lista
          </Button>
        </Stack>

        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={0.5}
          >
            <Typography variant="caption" color="text.secondary">
              {conferidos} de {items.length} itens conferidos
            </Typography>
            <Typography variant="caption" fontWeight={600} color="primary.main">
              {progress}%
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </Card>

      {error && <Alert severity="error">{error}</Alert>}

      <Stack alignItems="center" paddingTop={1}>
        <Stack width="100%" maxWidth={480} gap={3} alignItems="center">
          {currentItem ? (
            <React.Fragment>
              <Chip
                label={`${index + 1} / ${items.length}`}
                size="small"
                sx={{ bgcolor: "background.default", color: "text.secondary" }}
              />

              <Box textAlign="center">
                <Typography variant="h4" fontWeight={600}>
                  {currentItem.insumo_nome}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Quantidade Teórica:{" "}
                  {formatAuditQuantity(
                    currentItem.quantidade_teorica,
                    currentItem.unidade_medida,
                  )}
                </Typography>
              </Box>

              <Box width="100%">
                <SectionLabel>Quantidade encontrada</SectionLabel>
                <Stack alignItems="center">
                  <OutlinedInput
                    value={quantidade}
                    onChange={(event) =>
                      setQuantidade(
                        maskAuditQuantity(
                          event.target.value,
                          currentItem.unidade_medida,
                        ),
                      )
                    }
                    placeholder={
                      isIntegerAuditUnit(currentItem.unidade_medida)
                        ? "0"
                        : "0.00"
                    }
                    inputProps={{
                      inputMode: "numeric",
                      "aria-label": `Quantidade encontrada de ${currentItem.insumo_nome}`,
                      style: { textAlign: "center" },
                    }}
                    endAdornment={
                      <Typography variant="body2" color="text.secondary">
                        {currentItem.unidade_medida}
                      </Typography>
                    }
                    sx={{ borderRadius: 999, width: 220 }}
                  />
                </Stack>
              </Box>

              <Box width="100%">
                <SectionLabel>Quantidade divergente</SectionLabel>
                <Stack alignItems="center">
                  <Typography variant="h6" fontWeight={400}>
                    {divergenciaAtual === null
                      ? 0
                      : formatAuditQuantity(divergenciaAtual)}
                  </Typography>
                  <Divider
                    sx={{ width: 180, borderColor: "divider", marginY: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {currentItem.unidade_medida}
                  </Typography>
                </Stack>
              </Box>

              <Box width="100%">
                <SectionLabel align="left">Observação</SectionLabel>
                <OutlinedInput
                  multiline
                  minRows={3}
                  fullWidth
                  placeholder="Adicionar observação sobre este item..."
                  value={observacao}
                  onChange={(event) => setObservacao(event.target.value)}
                  sx={{ borderRadius: 2, fontSize: 14 }}
                />
              </Box>

              <Box width="100%">
                <Stack direction="row" alignItems="center" gap={1}>
                  <SectionLabel align="left">Fotos</SectionLabel>
                  {itemPhotos.length > 0 && (
                    <Typography
                      variant="caption"
                      color="primary.main"
                      fontWeight={600}
                      textTransform="uppercase"
                      letterSpacing={1}
                      marginBottom={1}
                    >
                      {itemPhotos.length}{" "}
                      {itemPhotos.length === 1 ? "foto" : "fotos"}
                    </Typography>
                  )}
                </Stack>

                <Stack direction="row" gap={1.5} flexWrap="wrap">
                  {itemPhotos.map((photo, photoIndex) => (
                    <Stack key={photo.id} alignItems="center" gap={0.5}>
                      <PhotoThumb photo={photo} index={photoIndex} />
                      <Typography variant="caption" color="text.secondary">
                        Foto {photoIndex + 1}
                      </Typography>
                    </Stack>
                  ))}

                  {addPhotoButton(() => itemFileRef.current?.click())}
                </Stack>

                <input
                  ref={itemFileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(event) => handleFileChange(event, currentItem.id)}
                />
              </Box>

              <Button
                variant="text"
                onClick={() => setView("resumo")}
                sx={{ color: "text.secondary" }}
              >
                Ver resumo da conferência
              </Button>
            </React.Fragment>
          ) : (
            <Stack alignItems="center" paddingY={4} gap={1}>
              <ImageIcon width={28} height={28} />
              <Typography variant="body2" color="text.secondary">
                Esta auditoria não tem itens para conferir.
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>

      {currentItem && (
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            marginTop: "auto",
            paddingY: 2,
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction="row"
            gap={2}
            width="100%"
            maxWidth={480}
            marginX="auto"
          >
            <Button
              variant="outlined"
              sx={{ flex: 1 }}
              startIcon={<KeyboardArrowLeft />}
              onClick={handlePrevious}
              disabled={index === 0 || isSaving}
            >
              Anterior
            </Button>

            <Button
              variant="contained"
              sx={{ flex: 2 }}
              endIcon={!isLastItem ? <KeyboardArrowRight /> : undefined}
              onClick={handleNext}
              disabled={isSaving}
            >
              {isSaving
                ? "Salvando..."
                : isLastItem
                  ? "Concluir conferência"
                  : "Próximo"}
            </Button>
          </Stack>
        </Box>
      )}

      <Drawer
        anchor="right"
        open={isListOpen}
        onClose={() => setIsListOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", sm: 400 },
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          padding={2}
          gap={2}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Lista de Itens
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {conferidos} conferidos · {pendentes} pendentes
            </Typography>
          </Box>

          <IconButton
            aria-label="Fechar lista"
            onClick={() => setIsListOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>

        <Stack paddingX={2} paddingBottom={2} gap={1.5}>
          <OutlinedInput
            size="small"
            placeholder="Buscar insumo..."
            value={listSearch}
            onChange={(event) => setListSearch(event.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon width={18} height={18} />
              </InputAdornment>
            }
            sx={{ borderRadius: 2 }}
          />

          <Stack direction="row" gap={1}>
            {listFilters.map((filter) => {
              const isActive = listFilter === filter.value;

              return (
                <Button
                  key={filter.value}
                  variant={isActive ? "contained" : "text"}
                  size="small"
                  onClick={() => setListFilter(filter.value)}
                  sx={{
                    flex: 1,
                    bgcolor: isActive ? undefined : "background.default",
                    color: isActive ? undefined : "text.secondary",
                  }}
                >
                  {filter.label}
                </Button>
              );
            })}
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: "grey.100" }} />

        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {listItems.map((item) => {
            const conferida = toAuditNumber(item.quantidade_encontrada);
            const isCurrent = item.id === currentItemId;

            return (
              <Box
                key={item.id}
                component="button"
                type="button"
                onClick={() => goToItem(item.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  width: "100%",
                  textAlign: "left",
                  padding: 1.5,
                  cursor: "pointer",
                  border: 0,
                  borderLeft: "3px solid",
                  borderLeftColor: isCurrent ? "primary.main" : "transparent",
                  borderBottom: "1px solid",
                  borderBottomColor: "grey.100",
                  bgcolor: isCurrent ? "primary.light" : "background.paper",
                }}
              >
                {conferida !== null ? (
                  <CircledCheckIcon
                    width={22}
                    height={22}
                    color={theme.palette.success.contrastText}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: "divider",
                      flexShrink: 0,
                    }}
                  />
                )}

                <Box flex={1} minWidth={0}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={isCurrent ? "primary.main" : "text.primary"}
                    noWrap
                  >
                    {item.insumo_nome}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.unidade_medida}
                  </Typography>
                </Box>

                {conferida !== null ? (
                  <Chip
                    label={formatListQuantity(conferida, item.unidade_medida)}
                    size="small"
                    color="success"
                  />
                ) : isCurrent ? (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      flexShrink: 0,
                    }}
                  />
                ) : null}
              </Box>
            );
          })}

          {listItems.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              paddingY={4}
            >
              Nenhum item encontrado.
            </Typography>
          )}
        </Box>
      </Drawer>

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
