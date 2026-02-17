import {
  Stack,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { MenuItemCardProps } from "./";
import Card from "@/components/Cards/Card";

const tipoColorMap: Record<string, "success" | "info" | "purple" | "pink" | "orange"> =
{
  "prato principal": "orange",
  "acompanhamento": "info",
  "sobremesa": "pink",
  "bebida": "purple",
  "salada": "success",
};

const MenuItemCard = ({ item, onSelect, selectedItems }: MenuItemCardProps) => {
  const selected = selectedItems.includes(item.id);

  return (
    <Card
      key={item.id}
      sx={{
        padding: 2,
        border: "1px solid",
        borderColor: selected ? "text.secondary" : "divider",
        bgcolor: selected ? "background.default" : "transparent",
        cursor: "pointer",
        "&:hover": {
          borderColor: "text.secondary",
          transform: "translateY(-1px)",
          boxShadow: 2,
        }
      }}
      spacing={1}
      onClick={() => onSelect(item)}
    >

      <Stack direction={"row"} gap={2} alignItems="center" justifyContent="space-between">
        <Chip
          label={item.tipo}
          color={tipoColorMap[item.tipo]}
          size="small"
          sx={{
            textTransform: "capitalize",
            padding: 0,
            width: "fit-content",
          }}
        />
        <Typography
          variant="caption"
          color={selected ? "success.contrastText" : "transparent"}
          sx={{
            transition: ".2s all"
          }}
        >
          ✓ Selecionado
        </Typography>
      </Stack>

      <Box>
        <Typography fontWeight="500" variant="body2">{item.nome}</Typography>
        <Typography variant="caption" color="text.secondary">
          {item.descricao}
        </Typography>
      </Box>

      <Stack direction={"row"} gap={1}>
        {item.categorias.map((categoria, i) => (
          <Chip
            key={i}
            label={categoria}
            size="small"
            color="success"
            sx={{
              textTransform: "capitalize",
              padding: 0,
            }}
          />
        ))}
      </Stack>
    </Card>
  );
};

export default MenuItemCard;
