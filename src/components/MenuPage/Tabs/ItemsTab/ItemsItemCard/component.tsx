import {
  Stack,
  Box,
  Typography,
  Chip,
  IconButton,
  useTheme,
  Tooltip
} from "@mui/material";
import { EditIcon, TrashIcon } from "@/components/Icons";
import { ItemsItemCardProps } from "./";
import React from "react";
import Card from "@/components/Cards/Card";
import EditMenuItemModal from "@/components/Modals/EditMenuItemModal";
import ActionModal from "@/components/Modals/ActionModal";

const tipoColorMap: Record<string, "success" | "info" | "purple" | "pink" | "orange"> =
{
  "prato principal": "orange",
  "acompanhamento": "info",
  "sobremesa": "pink",
  "bebida": "purple",
  "salada": "success",
};

const ItemsItemCard = ({ item }: ItemsItemCardProps) => {
  const theme = useTheme();

  const [openEditItemModal, setOpenEditItemModal] = React.useState(false);
  const [openDeleteItemModal, setOpenDeleteItemModal] = React.useState(false);

  return (
    <Card key={item.id} sx={{ padding: 2 }} spacing={1}>
      <Stack direction={"row"} gap={2} alignItems="center" justifyContent="space-between">
        <Chip
          label={item.categoria}
          color={tipoColorMap[item.categoria]}
          size="small"
          sx={{
            textTransform: "capitalize",
            padding: 0,
          }}
        />

        <Stack direction={"row"} gap={1} alignItems="center" >
          <Tooltip title="Editar item">
            <IconButton
              size="small"
              sx={{
                padding: "4px",
                height: "fit-content",
              }}
              onClick={() => setOpenEditItemModal(true)}
            >
              <EditIcon width={20} color={theme.palette.info.contrastText} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Excluir item">
            <IconButton
              size="small"
              sx={{
                padding: "4px",
                height: "fit-content",
              }}
              onClick={() => setOpenDeleteItemModal(true)}
            >
              <TrashIcon width={20} color={theme.palette.error.contrastText} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Box>
        <Typography fontWeight="500" variant="body2">{item.nome}</Typography>
        <Typography variant="caption" color="text.secondary">
          {item.descricao}
        </Typography>
      </Box>

      <Stack direction={"row"} gap={1}>
        {item.restricoes.map((restricao, i) => (
          <Chip
            key={i}
            label={restricao}
            size="small"
            color="success"
            sx={{
              textTransform: "capitalize",
              padding: 0,
            }}
          />
        ))}
      </Stack>

      {
        openEditItemModal && (
          <EditMenuItemModal
            open={openEditItemModal}
            onClose={() => setOpenEditItemModal(false)}
            onSave={() => console.log("Item updated:", item)}
            menuItem={item}
          />
        )
      }

      {
        openDeleteItemModal && (
          <ActionModal
            open={openDeleteItemModal}
            onCancel={() => setOpenDeleteItemModal(false)}
            onConfirm={() => console.log("Item deleted:", item)}
            title="Tem certeza?"
            subtitle={`Essa ação irá deletar o item "${item.nome}", deseja continuar?`}
            confirmLabel="Confirmar"
            cancelLabel="Cancelar"
            color="error"
            icon={<TrashIcon width={60} height={60} />}
          />
        )
      }
    </Card>
  );
};

export default ItemsItemCard;
