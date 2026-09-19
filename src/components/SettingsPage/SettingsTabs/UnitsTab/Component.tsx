"use client";

import {
  Alert,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { BuildingIcon, EditIcon, PlusIcon, TrashIcon } from "@/components/Icons";
import IconBox from "@/components/Cards/IconBox";
import ActionModal from "@/components/Modals/ActionModal";
import NewUnitModal from "@/components/Modals/NewUnitModal";
import EditUnitModal from "@/components/Modals/EditUnitModal";
import UnitPoliciesModal from "@/components/Modals/UnitPoliciesModal/Component";
import { useUser } from "@/context/AuthContext";
import { UnitListItem } from "@/Interfaces/Settings/settings";
import { settingsService } from "@/services/settingsService";
import { UnitsTabProps } from "./interface";
import Can from "@/components/Can";

export default function UnitsTab({}: UnitsTabProps) {
  const { activeContext, clearContext } = useUser();
  const [openNewUnitModal, setOpenNewUnitModal] = React.useState(false);
  const [openEditUnitModal, setOpenEditUnitModal] = React.useState(false);
  const [openUnitPoliciesModal, setOpenUnitPoliciesModal] = React.useState(false);
  const [selectedUnit, setSelectedUnit] = React.useState<UnitListItem | null>(null);
  const [deleteCandidate, setDeleteCandidate] = React.useState<UnitListItem | null>(null);
  const [units, setUnits] = React.useState<UnitListItem[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const loadUnits = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      setUnits(await settingsService.listUnits());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Erro ao carregar unidades",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadUnits();
  }, [loadUnits]);

  const handleCloseDeleteModal = () => {
    if (!isDeleting) setDeleteCandidate(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate || isDeleting) return;

    const unit = deleteCandidate;
    const isActiveUnit = unit.id === activeContext?.unidade_id;

    setError(null);
    setIsDeleting(true);

    try {
      await settingsService.deleteUnit(unit.id);
      setDeleteCandidate(null);

      if (isActiveUnit) {
        void clearContext({ removedUnitId: unit.id });
        return;
      }

      await loadUnits();
    } catch (deleteError) {
      setDeleteCandidate(null);
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Erro ao excluir unidade",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const isDeletingActiveUnit =
    deleteCandidate?.id === activeContext?.unidade_id;

  return (
    <>
      <Stack
        spacing={2}
        justifyContent="space-between"
        direction="row"
        alignItems="center"
      >
        <Typography variant="h6" fontWeight={400}>
          Unidades Cadastradas
        </Typography>
        <Can module="unidade" action="create">
          <Button
            variant="contained"
            startIcon={<PlusIcon />}
            sx={{ fontWeight: 400, paddingY: 1.5 }}
            onClick={() => setOpenNewUnitModal(true)}
            disabled={isDeleting}
          >
            Nova Unidade
          </Button>
        </Can>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {isLoading ? (
        <Typography color="text.secondary">Carregando unidades...</Typography>
      ) : (
        <Stack gap={2}>
          {units.map((unit) => (
            <Stack
              key={unit.id}
              gap={2}
              direction="row"
              alignItems="flex-start"
              border="1px solid"
              borderColor="divider"
              borderRadius={3}
              padding={2}
            >
              <IconBox
                icon={
                  <BuildingIcon
                    color={unit.ativo ? "#00A63E" : "#6B7280"}
                    width={24}
                    height={24}
                  />
                }
                bgColor={unit.ativo ? "#F0FDF4" : "background.default"}
              />
              <Stack gap={1.5} flex={1} minWidth={0}>
                <Stack gap={0.6}>
                  <Stack direction="row" flexWrap="wrap" alignItems="center" columnGap={1} rowGap={0.5}>
                    <Typography variant="body1">{unit.nome}</Typography>
                    <Chip
                      label={unit.status}
                      color={unit.ativo ? "success" : "default"}
                      size="small"
                      sx={{
                        textTransform: "capitalize",
                        fontSize: 12,
                      }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {unit.endereco}
                  </Typography>
                  <Typography variant="body2" color="#4A5565">
                    Responsável: {unit.responsavelNome}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  gap={1}
                  alignItems="center"
                  flexWrap="wrap"
                >
                <Can module="unidade" action="edit">
                  <Button
                    variant="outlined"
                    sx={{
                      minWidth: 0,
                      height: 40,
                      color: "#155DFC",
                      borderRadius: 3,
                      fontSize: 14,
                    }}
                    disabled={isDeleting}
                    onClick={() => {
                      setSelectedUnit(unit);
                      setOpenUnitPoliciesModal(true);
                    }}
                  >
                    Políticas
                  </Button>
                </Can>
                <Can module="unidade" action="edit">
                  <Tooltip title="Editar unidade" arrow>
                    <span>
                      <IconButton
                        aria-label="Editar unidade"
                        size="medium"
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 3,
                          color: "text.secondary",
                        }}
                        disabled={isDeleting}
                        onClick={() => {
                          setSelectedUnit(unit);
                          setOpenEditUnitModal(true);
                        }}
                      >
                        <EditIcon width={22} height={22} />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Can>
                <Can module="unidade" action="delete">
                  <Tooltip title="Excluir unidade" arrow>
                    <span>
                      <IconButton
                        aria-label="Excluir unidade"
                        size="medium"
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 3,
                          color: "error.contrastText",
                        }}
                        disabled={isDeleting}
                        onClick={() => setDeleteCandidate(unit)}
                      >
                        <TrashIcon width={22} height={22} />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Can>
                </Stack>
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}

      <NewUnitModal
        open={openNewUnitModal}
        onClose={() => setOpenNewUnitModal(false)}
        onCreated={loadUnits}
      />
      <EditUnitModal
        open={openEditUnitModal}
        onClose={() => setOpenEditUnitModal(false)}
        unitItem={selectedUnit}
        onSaved={loadUnits}
      />
      <UnitPoliciesModal
        open={openUnitPoliciesModal}
        onClose={() => setOpenUnitPoliciesModal(false)}
        unitItem={selectedUnit}
        onSaved={loadUnits}
      />

      {deleteCandidate && (
        <ActionModal
          open
          loading={isDeleting}
          onCancel={handleCloseDeleteModal}
          onConfirm={() => void handleConfirmDelete()}
          title={isDeletingActiveUnit ? "Excluir unidade atual?" : "Excluir unidade?"}
          subtitle={
            isDeletingActiveUnit
              ? "Você está excluindo a unidade que está acessando no momento. Tem certeza de que deseja continuar?"
              : `Essa ação irá excluir a unidade "${deleteCandidate.nome}". Tem certeza de que deseja continuar?`
          }
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          color="error"
          icon={<TrashIcon width={60} height={60} />}
        />
      )}
    </>
  );
}
