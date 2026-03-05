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
import { formatDate } from "@/utils/formatDate";

const MenuItemCard = ({ item }: MenuItemCardProps) => {
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
            {formatDate(new Date(item.data), "dd/MM/yyyy")}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={"400"}
          >
            {item.unidade}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          Tipo:
        </Typography>
        <Typography variant="body2">{item.tipo}</Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          Horário:
        </Typography>
        <Typography variant="body2" component="span">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <ClockIcon
              width={16}
              height={16}
              color={theme.palette.text.secondary}
            />
            {item.horario.inicio} - {item.horario.fim}
          </span>
        </Typography>

      </Stack>

      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          Itens:
        </Typography>
        <Typography variant="body2">
          {item.refeicoes.length} ite{item.refeicoes.length > 1 ? "ns" : "m"}
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
          color={
            item.status === "ativo"
              ? "success"
              : item.status === "programado"
                ? "info"
                : "default"
          }
          label={item.status}
          size="medium"
          sx={{
            minWidth: "fit-content",
            paddingX: 0,
            textTransform: "capitalize",
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
            item.status !== "finalizado" && (
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
        data={item}
      />

      <EditMenuModal
        open={openEditMenuModal}
        onClose={() => setOpenEditMenuModal(false)}
        onSave={(data) => {
          console.log(data);
        }}
        menu={item}
      />
    </Stack>
  );
};

export default MenuItemCard;
