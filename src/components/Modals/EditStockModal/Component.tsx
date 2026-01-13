import React from "react";
import { Stack, Typography, Box, Button, Switch, Chip } from "@mui/material";
import { mockCategorias, mockUnidades, mockUnidadesMedida } from "@/data/menuItems";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { IStock } from "@/data/tableColumns";
import { EditStockModalProps } from "./";


export default function EditStockModal({
  open,
  onClose,
  stockItem,
  onSave,
}: EditStockModalProps) {
  const [itemName, setItemName] = React.useState(stockItem.item);
  const [categoria, setCategoria] = React.useState(stockItem.categoria);
  const [unidadeMedida, setUnidadeMedida] = React.useState(stockItem.unidadeMedida);
  const [saldo, setSaldo] = React.useState(stockItem.saldo);
  const [estoqueMinimo, setEstoqueMinimo] = React.useState(stockItem.estoqueMinimo);
  const [unidade, setUnidade] = React.useState(stockItem.unidade);
  const [status, setStatus] = React.useState(stockItem.status);


  const handleSave = () => {
    if (!stockItem) return;

    const updatedStock: Partial<IStock> = {
      ...stockItem,
      item: itemName,
      categoria,
      saldo,
      estoqueMinimo,
      unidade,
      status,
    };

    onSave(updatedStock);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Item de Estoque">
      <Stack gap={2}>
        <Input
          value={itemName}
          onChange={setItemName}
          label="Nome do Item"
          placeholder="Ex. Arroz Branco"
          optional={false}
        />

        <Stack direction="row" spacing={2}>
          <Select
            value={categoria}
            label="Categoria"
            optional={false}
            onChange={setCategoria}
            options={mockCategorias}
          />
          <Select
            value={unidadeMedida}
            label="Unidade de Medida"
            optional={false}
            onChange={setUnidadeMedida}
            options={mockUnidadesMedida}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Input
            value={saldo}
            onChange={setSaldo}
            label="Saldo"
            placeholder="0"
            optional={false}
            sx={{ flex: 1 }}
          />
          <Input
            value={estoqueMinimo}
            onChange={setEstoqueMinimo}
            label="Estoque Mínimo"
            placeholder="0"
            optional={false}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Select
          value={unidade}
          label="Unidade"
          optional={true}
          onChange={setUnidade}
          options={mockUnidades}
        />

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.primary">Status do Item</Typography>
            <Typography color="text.secondary" variant="body2">
              Itens inativos não aparecem nas movimentações
            </Typography>
          </Box>
          <Switch
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
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
            onClick={handleSave}
          >
            Salvar Alterações
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
