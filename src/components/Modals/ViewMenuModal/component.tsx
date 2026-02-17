import { Box, Button, Chip, Grid, Stack, Typography, useTheme } from "@mui/material";
import Modal from "../Modal";
import { ViewMenuModalProps } from "./";
import { ClockIcon, RefeicoesIcon } from "@/components/Icons";

const categoriaColorMap: Record<string, "success" | "info" | "purple" | "pink" | "orange"> =
{
  "prato principal": "orange",
  "acompanhamento": "info",
  "sobremesa": "pink",
  "bebida": "purple",
  "salada": "success",
};


export function ViewMenuModal({
  isOpen,
  onClose,
  data,
}: ViewMenuModalProps) {
  const theme = useTheme();

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={"Detalhes do Cardápio"}
      subtitle={data.data + " - " + data.tipo}>
      <Stack gap={2}>
        <Typography >
          Informações
        </Typography>
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
            <Typography variant="body2" color="text.secondary">
              Data:
            </Typography>
            <Typography>
              {data.data}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Unidade:
            </Typography>
            <Typography>
              {data.unidade}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Tipo de Refeição:
            </Typography>
            <Typography textTransform={"capitalize"}>
              {data.tipo}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Horário:
            </Typography>
            <Stack direction={"row"} gap={.6} alignItems="center">
              <ClockIcon height={20} color={theme.palette.grey[400]} />
              <Typography>
                {data.horario.inicio} - {data.horario.fim}
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Status:
            </Typography>
            <Typography textTransform={"capitalize"}>
              {data.status}
            </Typography>
          </Grid>
        </Grid>

        <Stack direction={"row"} alignItems={"center"} gap={1}>
          <RefeicoesIcon height={22} width={22} color={theme.palette.primary.main} />
          <Typography >
            Itens do Cardápio ({data.refeicoes.length})
          </Typography>
        </Stack>
        <Stack gap={2} maxHeight={"250px"} overflow={"auto"}>
          {data.refeicoes.map((item, i) => (
            <Stack
              key={i}
              sx={{
                padding: 2,
                border: "1px solid",
                borderColor: theme.palette.divider,
                borderRadius: 3
              }}
              gap={1}
              direction={"row"}
            >
              <Chip
                label={item.categoria}
                color={categoriaColorMap[item.categoria]}
                size="small"
                sx={{
                  textTransform: "capitalize",
                  padding: 0,
                  width: "fit-content",
                }}
              />
              <Box>
                <Typography fontWeight="500">{item.nome}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.descricao}
                </Typography>
                <Stack direction={"row"} gap={1} mt={1}>
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
              </Box>
            </Stack>
          ))}
        </Stack>
        <Button
          variant="outlined"
          sx={{
            flex: 1,
            transition: "all 0.2s ease-in-out",
            "&:hover": { color: "text.primary" },
          }}
          onClick={onClose}
        >
          Fechar
        </Button>
      </Stack>
    </Modal>
  );
}
