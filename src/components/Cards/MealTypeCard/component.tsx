"use client";

import Card from "@/components/Cards/Card";
import IconBox from "@/components/Cards/IconBox";
import { ClockIcon, EditIcon, RefeicoesIcon, TrashIcon } from "@/components/Icons";
import { Alert, Box, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { MealTypeCardProps } from "./interface";
import React from "react";
import EditMealTypeModal from "@/components/Modals/EditMealTypeModal";
import { formatTime } from "@/utils/formatDateTime";
import { ActionModal } from "@/components/Modals/ActionModal/component";

export function MealTypeCard({ type, onUpdated, onNotify }: MealTypeCardProps) {
  const {
    id,
    typeName,
    description,
    startTime,
    endTime,
    status,
    units,
    validations,
  } = type;

  const [openEditTypeModal, setOpenEditTypeModal] = React.useState(false);
  const [openDeleteTypeModal, setOpenDeleteTypeModal] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const theme = useTheme();

  const handleDeleteMealType = async () => {
    if (isDeleting) return;

    setDeleteError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/tipo-refeicao/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao excluir tipo de refeição" }));
        throw new Error(errData.message ?? "Erro ao excluir tipo de refeição");
      }

      onNotify?.("Tipo de refeição excluído com sucesso", "success");
      setOpenDeleteTypeModal(false);
      onUpdated?.();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao excluir tipo de refeição";

      setDeleteError(message);
      onNotify?.(message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      variant="compact"
      sx={{ padding: "1rem", maxWidth: { md: "49%" }, minWidth: "49%" }}>
      {deleteError && <Alert severity="error">{deleteError}</Alert>}

      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack gap={2} direction={"row"}>
          <IconBox
            icon={<RefeicoesIcon color={theme.palette.primary.main} />}
            bgColor="sidebar.bgActive"
          />
          <Box component="span" alignContent={"center"}>
            <Stack direction={"row"} gap={1}>
              <Typography>{typeName}</Typography>
              <Chip
                color={status ? "success" : "default"}
                label={status ? "Ativo" : "Inativo"}
                size="small"
                sx={{ minWidth: "fit-content" }}
              />
            </Stack>
            <Typography
              variant="subtitle1"
              fontWeight={400}
              color="text.secondary">
              {description}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" gap={1}>
          <Tooltip title="Editar refeição" arrow>
            <IconButton
              aria-label="edit"
              size="small"
              onClick={() => setOpenEditTypeModal(true)}
              sx={{
                marginRight: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                height: "2.25rem",
                color: "default.dark",
              }}>
              <EditIcon height={20} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Excluir refeição" arrow>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => setOpenDeleteTypeModal(true)}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                height: "2.25rem",
                color: "text.secondary",
              }}>
              <TrashIcon width={20} color={theme.palette.error.contrastText} />
            </IconButton>
          </Tooltip>
        </Stack>

        <EditMealTypeModal
          open={openEditTypeModal}
          onClose={() => setOpenEditTypeModal(false)}
          typeId={id}
          initialData={type}
          onSuccess={onUpdated}
          onNotify={onNotify}
        />

        {openDeleteTypeModal && (
          <ActionModal
            open={openDeleteTypeModal}
            onCancel={() => setOpenDeleteTypeModal(false)}
            onConfirm={handleDeleteMealType}
            title="Tem certeza?"
            subtitle={`Essa ação irá deletar o tipo de refeição "${typeName}", deseja continuar?`}
            confirmLabel={isDeleting ? "Deletando..." : "Deletar"}
            cancelLabel="Cancelar"
            color="primary"
            icon={<TrashIcon width={60} height={60} />}
          />
        )}
      </Stack>

      <Stack gap={2}>
        <Box>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Horário:
          </Typography>

          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <Stack sx={{ color: "default.dark" }}>
              <ClockIcon />
            </Stack>

            <Typography>
              {formatTime(startTime)} – {formatTime(endTime)}
            </Typography>
          </Stack>
        </Box>

        <Stack direction={"row"}>
          <Stack width={"50%"}>
            <Typography variant="body2" color="text.secondary">
              Validações:
            </Typography>
            <Stack direction={"row"} gap={"5px"} flexWrap={"wrap"}>
              {validations?.map((validation) => (
                <Chip
                  key={validation.id}
                  label={validation.shortLabel}
                  icon={validation.icon}
                  size="small"
                  color={validation.chipColor}
                  sx={{ width: "fit-content" }}
                />
              ))}
            </Stack>
          </Stack>

          <Stack>
            <Typography variant="body2" color="text.secondary">
              Unidades:
            </Typography>

            <Stack direction={"row"} flexWrap={"wrap"} gap={"5px"}>
              {units?.map((unit) => (
                <Chip
                  key={unit.id}
                  label={unit.label}
                  size="small"
                  color={"info"}
                  sx={{ width: "fit-content" }}
                />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
