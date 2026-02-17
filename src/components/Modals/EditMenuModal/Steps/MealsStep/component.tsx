import { Box, Button, Grid, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { MealsStepProps } from "./";
import { CookHatIcon, SearchIcon, XIcon } from "@/components/Icons";
import Input from "@/components/FormControl/Input";
import MenuItemCard from "../../MenuItemCard";

export function MealsStep({
  registerSearch,
  filteredItems,
  watchRefeicoes,
  setValue,
  reset,
  errors,
  setCurrentStep,
}: MealsStepProps) {
  const theme = useTheme();

  return (
    <>
      <Stack direction="row" gap={1}>
        <CookHatIcon color={theme.palette.primary.main} width={20} height={20} />
        <Typography fontWeight={600} color="text.label">
          Itens do Cardápio
        </Typography>
      </Stack>

      <Stack gap={2} padding={2} borderRadius={3} border={"1px solid"} borderColor={"divider"}>
        <Input
          label={`Selecione da Biblioteca (${filteredItems.length} itens disponíveis)`}
          placeholder="Buscar por nome, matrícula..."
          icon={<SearchIcon />}
          register={registerSearch("menuItemSearch")}
        />

        <Grid container spacing={2} maxHeight={300} overflow="auto" paddingTop={"1px"}>
          {filteredItems.map((item, i) => (
            <Grid key={i} size={{ xs: 12, md: 6 }}>
              <MenuItemCard
                item={item}
                selectedItems={watchRefeicoes?.map(r => r.id) || []}
                onSelect={(selectedItem) => {
                  const current = watchRefeicoes || [];
                  const exists = current.find(r => r.id === selectedItem.id);
                  if (exists) {
                    setValue("refeicoes", current.filter(r => r.id !== selectedItem.id));
                  } else {
                    setValue("refeicoes", [...current, selectedItem]);
                  }
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>

      <Stack gap={1} maxHeight={"202px"} overflow="auto">
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          justifyContent="space-between"
        >
          <Typography fontWeight={500} color="text.label">
            Itens Selecionados ({watchRefeicoes?.length || 0})
          </Typography>
          <Button
            variant="text"
            size="medium"
            disabled={!watchRefeicoes || watchRefeicoes.length === 0}
            onClick={() => {
              reset({
                refeicoes: [],
              });
            }}
            sx={{
              color: "error.contrastText"
            }}
          >
            Limpar todos
          </Button>
        </Stack>
        {
          watchRefeicoes && watchRefeicoes.length > 0 ?
            (
              watchRefeicoes.map((item, i) => (
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems="center"
                  key={i}
                  padding={2}
                  borderRadius={3}
                  border={"1px solid"}
                  borderColor={"divider"}
                >
                  <Box>
                    <Typography fontWeight={500}>
                      {item.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.descricao}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      const current = watchRefeicoes || [];
                      setValue("refeicoes", current.filter(r => r.id !== item.id));
                    }}
                    color="error"
                  >
                    <XIcon width={20} height={20} color={theme.palette.error.contrastText} />
                  </IconButton>
                </Stack>
              ))
            ) :
            (
              <Box padding={3} borderRadius={3} border={"1px solid"} borderColor={"divider"}>
                <Typography color="text.secondary" textAlign="center">
                  Nenhum item selecionado
                </Typography>
                {
                  errors.refeicoes && (
                    <Typography
                      color="error.contrastText"
                      variant="body2"
                      textAlign="center"
                    >
                      {errors.refeicoes.message}
                    </Typography>
                  )
                }
              </Box>
            )
        }
      </Stack>

      <Stack direction="row" gap={2}>
        <Button
          variant="outlined"
          sx={{
            flex: 1,
            transition: "all 0.2s ease-in-out",
            "&:hover": { color: "text.primary" },
          }}
          onClick={() => setCurrentStep(0)}
        >
          Voltar
        </Button>
        <Button
          sx={{ flex: 1 }}
          variant="contained"
          type="submit"
        >
          Editar Cardápio
        </Button>
      </Stack>
    </>
  );
}
