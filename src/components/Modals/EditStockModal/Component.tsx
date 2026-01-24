import React from "react";
import { Stack, Typography, Box, Button, Switch } from "@mui/material";
import { mockCategorias, mockUnidades, mockUnidadesMedida } from "@/data/menuItems";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { IStock } from "@/data/tableColumns";
import { EditStockModalProps } from "./";
import { useForm } from "react-hook-form";
import { stockSchema } from "@/schemas/stockSchema";
import { yupResolver } from "@hookform/resolvers/yup";


export default function EditStockModal({
  open,
  onClose,
  stockItem,
  onSave,
}: EditStockModalProps) {

  const { register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    control,
  } = useForm<IStock>({
    resolver: yupResolver(stockSchema),
    defaultValues:
      stockItem,
  });

  const onSubmit = (data: IStock) => {
    onSave(data);
    onClose();
  };

  React.useEffect(() => {
    if (open && stockItem) {
      reset(stockItem

      )
    }
  }, [open, stockItem, reset]);

  return (
    <Modal open={open} onClose={onClose} title="Editar Item de Estoque">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nome do Item"
          placeholder="Ex. Arroz Branco"
          optional={false}
          register={register("item")}
          error={errors.item?.message}
        />
        <Stack direction="row" spacing={2}>
          <Select
            name="categoria"
            control={control}
            label="Categoria"
            optional={false}
            options={mockCategorias}
            register={register("categoria")}
            error={errors.categoria?.message}
          />

          <Select
            name="unidadeMedida"
            control={control}
            label="Unidade de Medida"
            optional={false}
            options={mockUnidadesMedida}
            register={register("unidadeMedida")}
            error={errors.unidadeMedida?.message}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Input
            label="Saldo"
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

        <Select
          name="unidade"
          control={control}
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
          <Switch checked={watch("status")} onChange={(e) => setValue("status", e.target.checked)}
          />
        </Stack>

        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            sx={{
              flex: 1,
              fontSize: "1.2rem",
              border: "1px solid",
              borderColor: "divider",
              color: "text.secondary",
            }}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            sx={{
              flex: 1,
              fontSize: "1.2rem",
            }}
            variant="contained"
            type="submit"
          >
            Salvar Alterações
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
