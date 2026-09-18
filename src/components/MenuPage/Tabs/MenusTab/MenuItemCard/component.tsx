import {
  Stack,
  Box,
  Typography,
  Divider,
  Chip,
  IconButton,
  useTheme,
  Tooltip,
} from "@mui/material";
import { CalendarIcon, ClockIcon, EyeIcon, EditIcon } from "@/components/Icons";
import IconBox from "@/components/Cards/IconBox";
import { MenuItemCardProps } from "./";
import React from "react";
import ViewMenuModal from "@/components/Modals/ViewMenuModal";
import EditMenuModal from "@/components/Modals/EditMenuModal";
import { formatDateOnly } from "@/utils/formatDate";
import { StatusCardapio } from "@/Interfaces/Menu/menu";

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

const MenuItemCard = ({ item, onChanged }: MenuItemCardProps) => {
  const theme = useTheme();

  const [openEditMenuModal, setOpenEditMenuModal] = React.useState(false);
  const [openViewMenuModal, setOpenViewMenuModal] = React.useState(false);

  return (
    <Stack
      border={"1px solid"}
      borderColor="divider"
      borderRadius={2}
      padding={{ xs: 1, sm: 2 }}
      gap={1}
      minWidth={320}
      flexShrink={0}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <IconBox
          icon={<CalendarIcon color={theme.palette.info.contrastText} />}
          padding={1.6}
          bgColor="info.main"
        />
        <Box>
          <Typography variant="body2">
            {formatDateOnly(item.dataRefeicao)}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={"400"}
          >
            {item.unidadeNome}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          Tipo:
        </Typography>
        <Typography variant="body2">{item.tipoRefeicaoNome}</Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          Refeições Previstas:
        </Typography>
        <Typography variant="body2" component="span">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <ClockIcon
              width={16}
              height={16}
              color={theme.palette.text.secondary}
            />
            {item.numeroPrevistoRefeicoes}
          </span>
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          Pratos:
        </Typography>
        <Typography variant="body2">
          {item.pratos.length} ite{item.pratos.length > 1 ? "ns" : "m"}
        </Typography>
      </Stack>

      <Divider sx={{ my: 1, borderColor: "grey.100" }} />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <Chip
          color={statusColorMap[item.status]}
          label={statusLabelMap[item.status]}
          size="medium"
          sx={{
            minWidth: "fit-content",
            paddingX: 0,
          }}
        />
        <Stack direction="row" alignItems="center">
          <Tooltip title="Detalhes do cardápio" arrow>
            <IconButton
              size="small"
              sx={{ paddingY: 0, color: "primary.main" }}
              onClick={() => setOpenViewMenuModal(true)}
            >
              <EyeIcon width={22} height={22} />
            </IconButton>
          </Tooltip>

          {
            item.status !== "servido" && (
              <Tooltip title="Editar cardápio" arrow>
                <IconButton
                  size="small"
                  sx={{ paddingY: 0, color: "info.contrastText" }}
                  onClick={() => setOpenEditMenuModal(true)}
                >
                  <EditIcon width={20} height={20} />
                </IconButton>
              </Tooltip>
            )
          }
        </Stack>
      </Stack>

      <ViewMenuModal
        isOpen={openViewMenuModal}
        onClose={() => setOpenViewMenuModal(false)}
        cardapioId={item.id}
        onChanged={onChanged}
      />

      <EditMenuModal
        open={openEditMenuModal}
        onClose={() => setOpenEditMenuModal(false)}
        menu={item}
        onSaved={onChanged}
      />
    </Stack>
  );
};

export default MenuItemCard;
