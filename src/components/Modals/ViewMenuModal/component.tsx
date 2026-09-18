import { Alert, Box, Button, Chip, CircularProgress, Grid, Stack, Typography, useTheme } from "@mui/material";
import Modal from "../Modal";
import { ActionModal } from "../ActionModal/component";
import { ViewMenuModalProps } from "./";
import { ClockIcon, PlusIcon, TrashIcon } from "@/components/Icons";
import { formatDateOnly } from "@/utils/formatDate";
import { IMenu, mapApiCardapio, StatusCardapio } from "@/Interfaces/Menu/menu";
import { TIPO_PRATO_OPTIONS, RESTRICAO_ALIMENTAR_OPTIONS } from "@/schemas/pratoSchema";
import AddPratoModal from "../AddPratoModal";
import AddInsumoModal from "../AddInsumoModal";
import React from "react";

const statusColorMap: Record<StatusCardapio, "warning" | "info" | "success"> = {
  planejado: "warning",
  confirmado: "info",
  servido: "success",
};

const statusLabelMap: Record<StatusCardapio, string> = {
  planejado: "Planejado",
  confirmado: "Confirmado",
  servido: "Servido",
};

function tipoPratoLabel(tipo: string) {
  return TIPO_PRATO_OPTIONS.find((o) => o.value === tipo)?.label ?? tipo;
}

function restricaoLabel(id: string) {
  return RESTRICAO_ALIMENTAR_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

export function ViewMenuModal({ isOpen, onClose, cardapioId, onChanged }: ViewMenuModalProps) {
  const theme = useTheme();

  const [cardapio, setCardapio] = React.useState<IMenu | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [isChangingStatus, setIsChangingStatus] = React.useState(false);

  const [openAddPrato, setOpenAddPrato] = React.useState(false);
  const [openAddInsumo, setOpenAddInsumo] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const load = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/cardapio/${cardapioId}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Erro ao carregar cardápio");
      }
      setCardapio(mapApiCardapio(payload));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar cardápio");
    } finally {
      setIsLoading(false);
    }
  }, [cardapioId]);

  React.useEffect(() => {
    if (isOpen) load();
  }, [isOpen, load]);

  const handleChangeStatus = async (action: "confirmar" | "servir") => {
    setActionError(null);
    setIsChangingStatus(true);
    try {
      const response = await fetch(`/api/cardapio/${cardapioId}/${action}`, { method: "POST" });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Erro ao atualizar status");
      }
      await load();
      onChanged();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Erro ao atualizar status");
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setActionError(null);
    try {
      const response = await fetch(`/api/cardapio/${cardapioId}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: "Erro ao excluir cardápio" }));
        throw new Error(payload.message || "Erro ao excluir cardápio");
      }
      setOpenDelete(false);
      onChanged();
      onClose();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Erro ao excluir cardápio");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Detalhes do Cardápio" maxWidth="md">
      <Stack gap={2}>
        {error && <Alert severity="error">{error}</Alert>}
        {actionError && <Alert severity="error">{actionError}</Alert>}

        {isLoading || !cardapio ? (
          <Stack alignItems="center" padding={4}>
            <CircularProgress />
          </Stack>
        ) : (
          <>
            <Typography>Informações</Typography>
            <Grid
              container
              spacing={2}
              bgcolor={"background.default"}
              border={"1px solid"}
              borderColor={"divider"}
              borderRadius={2}
              padding={2}
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">Data:</Typography>
                <Typography>{formatDateOnly(cardapio.dataRefeicao)}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">Unidade:</Typography>
                <Typography>{cardapio.unidadeNome}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">Tipo de Refeição:</Typography>
                <Typography>{cardapio.tipoRefeicaoNome}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">Refeições Previstas:</Typography>
                <Stack direction={"row"} gap={.6} alignItems="center">
                  <ClockIcon height={20} color={theme.palette.grey[400]} />
                  <Typography>{cardapio.numeroPrevistoRefeicoes}</Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary">Status:</Typography>
                <Chip
                  label={statusLabelMap[cardapio.status]}
                  color={statusColorMap[cardapio.status]}
                  size="small"
                />
              </Grid>
              {cardapio.observacoes && (
                <Grid size={12}>
                  <Typography variant="body2" color="text.secondary">Observações:</Typography>
                  <Typography>{cardapio.observacoes}</Typography>
                </Grid>
              )}
            </Grid>

            <Stack direction="row" gap={2}>
              {cardapio.status === "planejado" && (
                <Button
                  variant="contained"
                  sx={{ flex: 1 }}
                  disabled={isChangingStatus}
                  onClick={() => handleChangeStatus("confirmar")}
                >
                  {isChangingStatus ? "Confirmando..." : "Confirmar Cardápio"}
                </Button>
              )}
              {cardapio.status === "confirmado" && (
                <Button
                  variant="contained"
                  sx={{ flex: 1 }}
                  disabled={isChangingStatus}
                  onClick={() => handleChangeStatus("servir")}
                >
                  {isChangingStatus ? "Marcando..." : "Marcar como Servido"}
                </Button>
              )}
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography>Pratos ({cardapio.pratos.length})</Typography>
              <Button size="small" startIcon={<PlusIcon />} onClick={() => setOpenAddPrato(true)}>
                Adicionar Prato
              </Button>
            </Stack>
            <Stack gap={1} maxHeight={"200px"} overflow={"auto"}>
              {cardapio.pratos.length === 0 && (
                <Typography variant="body2" color="text.secondary">Nenhum prato adicionado.</Typography>
              )}
              {cardapio.pratos.map((prato) => (
                <Stack
                  key={prato.id}
                  sx={{ padding: 2, border: "1px solid", borderColor: theme.palette.divider, borderRadius: 3 }}
                  gap={1}
                  direction={"row"}
                >
                  <Chip label={tipoPratoLabel(prato.tipoPrato)} size="small" color="orange" sx={{ width: "fit-content" }} />
                  <Box>
                    <Typography fontWeight="500">{prato.nome}</Typography>
                    {prato.descricao && (
                      <Typography variant="body2" color="text.secondary">{prato.descricao}</Typography>
                    )}
                    <Stack direction={"row"} gap={1} mt={1}>
                      {prato.restricoes.map((r) => (
                        <Chip key={r} label={restricaoLabel(r)} size="small" color="success" />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              ))}
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography>Insumos ({cardapio.insumosPrevistos.length})</Typography>
              <Button size="small" startIcon={<PlusIcon />} onClick={() => setOpenAddInsumo(true)}>
                Adicionar Insumo
              </Button>
            </Stack>
            <Stack gap={1} maxHeight={"200px"} overflow={"auto"}>
              {cardapio.insumosPrevistos.length === 0 && (
                <Typography variant="body2" color="text.secondary">Nenhum insumo adicionado.</Typography>
              )}
              {cardapio.insumosPrevistos.map((insumo) => (
                <Stack
                  key={insumo.id}
                  direction="row"
                  justifyContent="space-between"
                  sx={{ padding: 1.5, border: "1px solid", borderColor: theme.palette.divider, borderRadius: 3 }}
                >
                  <Typography variant="body2">{insumo.insumoNome}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Previsto: {insumo.quantidadePrevista}
                    {insumo.quantidadeReal !== null ? ` · Real: ${insumo.quantidadeReal}` : ""}
                  </Typography>
                </Stack>
              ))}
            </Stack>

            <Stack direction="row" gap={2}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<TrashIcon width={18} height={18} />}
                onClick={() => setOpenDelete(true)}
              >
                Excluir Cardápio
              </Button>
              <Button
                variant="outlined"
                sx={{ flex: 1, transition: "all 0.2s ease-in-out", "&:hover": { color: "text.primary" } }}
                onClick={onClose}
              >
                Fechar
              </Button>
            </Stack>

            <AddPratoModal
              open={openAddPrato}
              onClose={() => setOpenAddPrato(false)}
              cardapioId={cardapio.id}
              onAdded={load}
            />
            <AddInsumoModal
              open={openAddInsumo}
              onClose={() => setOpenAddInsumo(false)}
              cardapioId={cardapio.id}
              onAdded={load}
            />

            {openDelete && (
              <ActionModal
                open={openDelete}
                onCancel={() => setOpenDelete(false)}
                onConfirm={handleDelete}
                title="Tem certeza?"
                subtitle={`Essa ação irá excluir o cardápio de ${formatDateOnly(cardapio.dataRefeicao)}, deseja continuar?`}
                confirmLabel={isDeleting ? "Excluindo..." : "Excluir"}
                cancelLabel="Cancelar"
                color="error"
                icon={<TrashIcon width={60} height={60} />}
              />
            )}
          </>
        )}
      </Stack>
    </Modal>
  );
}
