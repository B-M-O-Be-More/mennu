import React from "react";
import { Stack, Typography, Box, Button, Switch } from "@mui/material";
import { mockCategorias, mockUnidades, mockUnidadesMedida } from "../../../data/menuItems";
import { NewMovementModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { ArrowIcon, CircledCheckIcon, EditIcon, TrashIcon } from "@/components/Icons";
import { Card } from "@/components/Cards/Card/Component";

const movementTypeItems = [
  { id: 0, label: "Entrada", icon: <ArrowIcon style={{ transform: "rotate(90deg)" }} width={16} height={16} color="#00A63E" /> },
  { id: 1, label: "Saída", icon: <ArrowIcon style={{ transform: "rotate(-90deg)" }} width={16} height={16} color="#155DFC" /> },
  { id: 2, label: "Perda", icon: <TrashIcon width={16} height={16} color="#E7000B" /> },
  { id: 3, label: "Ajuste", icon: <EditIcon width={16} height={16} color="#9810FA" /> },
];

export default function NewMovementModal({ open, onClose }: NewMovementModalProps) {
  const [newMovementType, setNewMovementType] = React.useState(0);
  const [newMovementItem, setNewMovementItem] = React.useState("");
  const [newMovementQuantidade, setNewMovementQuantidade] = React.useState("");
  const [newMovementJustification, setNewMovementJustification] = React.useState("");

  const handleSave = () => {
    console.log({
      newMovementItem,
      newMovementType,
      newMovementQuantidade,
      newMovementJustification,
    });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Novo Item de Estoque">
      <Stack gap={2}>

        <Box>
          <Typography
            variant="body2"
            mb={1} color="text.label" fontWeight={400}
          >
            Tipo de Movimentação
            <Typography variant="body2" component="span" color="primary.main" ml={.3}>*</Typography>
          </Typography>
          <Box
            display="grid"
            gap={1}
            gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))"
          >
            {movementTypeItems.map((item) => (
              <Card
                key={item.id}
                alignItems="center"
                justifyContent="center"
                paddingY={1}
                spacing={1}
                sx={{
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "all 0.2s ease-in-out",
                  border: "2px solid",
                  borderColor: newMovementType === item.id ? "primary.main" : "divider",
                  backgroundColor: newMovementType === item.id ? "#FFE9E3" : "",
                  "&:hover": {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => setNewMovementType(item.id)}
              >
                {item.icon}
                <Typography variant="body2">
                  {item.label}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>

        <Select
          value={newMovementItem}
          label="Item"
          optional={false}
          onChange={setNewMovementItem}
          options={mockCategorias}
        />

        <Input
          value={newMovementQuantidade}
          onChange={setNewMovementQuantidade}
          label="Quantidade"
          placeholder="0"
          type="number"
          optional={false}
          sx={{ flex: 1 }}
        />

        <Box>
          <Input
            value={newMovementJustification}
            onChange={setNewMovementJustification}
            label="Justificativa"
            placeholder="Descreva o motivo da perda ou ajuste..."
            optional={newMovementType > 1 ? false : true}
            sx={{ flex: 1 }}
          />
          <Typography variant="caption" color="text.secondary">Obrigatório para perdas e ajustes de estoque</Typography>
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          border={"1px solid #BEDBFF"}
          borderRadius={3}
          padding={2}
          gap={2}
          sx={{
            backgroundColor: "#EFF6FF",
          }}
        >
          <CircledCheckIcon color="#155DFC" />
          <Box>
            <Typography variant="body1" color="#1C398E">Atualização Automática de Saldo</Typography>
            <Typography variant="body2" color="#1447E6">O saldo será aumentado automaticamente.</Typography>
          </Box>
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
            onClick={() => { }}
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
            Registrar Movimentação
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
