import React from "react";
import { Stack, Typography, Box, Button, Switch } from "@mui/material";
import { mockCategorias, mockUnidades, mockUnidadesMedida } from "../../../data/menuItems";
import { NewStockModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";

export default function NewStockModal({ open, onClose }: NewStockModalProps) {
  const [newStockItem, setNewStockItem] = React.useState("");
  const [newStockCategoria, setNewStockCategoria] = React.useState(mockCategorias[0].value);
  const [newStockUnidadeMedida, setNewStockUnidadeMedida] = React.useState(mockUnidadesMedida[0].value);
  const [newStockBalance, setNewStockBalance] = React.useState("0");
  const [newStockMin, setNewStockMin] = React.useState("0");
  const [newStockUnidade, setNewStockUnidade] = React.useState(mockUnidades[0].value);
  const [newStockStatus, setNewStockStatus] = React.useState(true);

  const handleSave = () => {
    console.log({
      newStockItem,
      newStockCategoria,
      newStockUnidadeMedida,
      newStockBalance,
      newStockMin,
      newStockUnidade,
      newStockStatus,
    });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Novo Item de Estoque">
      <Stack gap={2}>
        <Stack direction="row" spacing={2}>
          <Input
            value={newStockItem}
            onChange={setNewStockItem}
            label="Nome do Item"
            placeholder="Ex. Arroz Branco"
            optional={false}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Select
            value={newStockCategoria}
            label="Categoria"
            optional={false}
            onChange={setNewStockCategoria}
            options={mockCategorias}
          />
          <Select
            value={newStockUnidadeMedida}
            label="Unidade de Medida"
            optional={false}
            onChange={setNewStockUnidadeMedida}
            options={mockUnidadesMedida}
          />
        </Stack>


        <Stack direction="row" spacing={2}>
          <Input
            value={newStockBalance}
            onChange={setNewStockBalance}
            label="Saldo Inicial"
            placeholder="0"
            optional={false}
            sx={{ flex: 1 }}
          />
          <Input
            value={newStockMin}
            onChange={setNewStockMin}
            label="Estoque Mínimo"
            placeholder="0"
            optional={false}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Select
          value={newStockUnidade}
          label="Unidade"
          optional={true}
          onChange={setNewStockUnidade}
          options={mockUnidades}
        />

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.primary">Status do Item</Typography>
            <Typography color="text.secondary" variant="body2">Itens inativos não aparecem nas movimentações</Typography>
          </Box>
          <Switch
            checked={newStockStatus}
            onChange={(e) => setNewStockStatus(e.target.checked)}
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
            sx={{
              flex: 1,
            }}
            variant="contained"
            onClick={handleSave}
          >
            Cadastrar Item
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
