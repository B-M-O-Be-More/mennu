import { Stack, Typography, Box, Button, Switch } from "@mui/material";
import { mockCategorias, mockUnidades, mockUnidadesMedida } from "../../../data/menuItems";
import { NewStockModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import SelectG from "@/components/FormControl/Select"; // novo SelectG
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IStock } from "@/data/tableColumns";
import { stockSchema } from "@/schemas/stockSchema";

export default function NewStockModal({ open, onClose }: NewStockModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IStock>({
    resolver: yupResolver(stockSchema),
    defaultValues: {
      item: "",
      categoria: mockCategorias[0].value,
      unidadeMedida: mockUnidadesMedida[0].value,
      saldo: "0",
      estoqueMinimo: "0",
      unidade: mockUnidades[0].value,
      status: true,
    },
  });

  const onSubmit = (data: IStock) => {
    console.log("Novo item de estoque:", data);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Novo Item de Estoque">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2}>
          <Input
            label="Nome do Item"
            placeholder="Ex. Arroz Branco"
            optional={false}
            sx={{ flex: 1 }}
            register={register("item")}
            error={errors.item?.message}
          />

          <Stack direction="row" spacing={2}>
            <SelectG
              label="Categoria"
              optional={false}
              options={mockCategorias}
              register={register("categoria")}
              error={errors.categoria?.message}
            />
            <SelectG
              label="Unidade de Medida"
              optional={false}
              options={mockUnidadesMedida}
              register={register("unidadeMedida")}
              error={errors.unidadeMedida?.message}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Input
              label="Saldo Inicial"
              placeholder="0"
              optional={false}
              sx={{ flex: 1 }}
              register={register("saldo")}
              error={errors.saldo?.message}
            />
            <Input
              label="Estoque Mínimo"
              placeholder="0"
              optional={false}
              sx={{ flex: 1 }}
              register={register("estoqueMinimo")}
              error={errors.estoqueMinimo?.message}
            />
          </Stack>

          <SelectG
            label="Unidade"
            optional={true}
            options={mockUnidades}
            register={register("unidade")}
            error={errors.unidade?.message}
          />

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography color="text.primary">Status do Item</Typography>
              <Typography color="text.secondary" variant="body2">
                Itens inativos não aparecem nas movimentações
              </Typography>
            </Box>
            <Switch
              checked={watch("status")}
              onChange={(e) => setValue("status", e.target.checked)}
            />
          </Stack>

          <Stack direction="row" gap={2}>
            <Button
              variant="outlined"
              sx={{
                flex: 1,
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.2s ease-in-out",
                "&:hover": { color: "text.primary" },
              }}
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              sx={{ flex: 1 }}
              variant="contained"
              type="submit"
            >
              Cadastrar Item
            </Button>
          </Stack>
        </Stack>
      </form>
    </Modal>
  );
}
