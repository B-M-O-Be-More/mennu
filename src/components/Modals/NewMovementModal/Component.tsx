import React from "react";
import { Stack, Typography, Box, Button } from "@mui/material";
import { mockCategorias } from "../../../data/menuItems";
import { NewMovementModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { ArrowIcon, CircledCheckIcon, EditIcon, TrashIcon } from "@/components/Icons";
import { Card } from "@/components/Cards/Card/Component";
import { useForm } from "react-hook-form";
import { IMovement } from "@/data/tableColumns";
import { movementSchema } from "@/schemas/movementSchema";
import { yupResolver } from "@hookform/resolvers/yup";

const movementTypeItems = [
  { id: 0, label: "Entrada", icon: <ArrowIcon style={{ transform: "rotate(90deg)" }} width={16} height={16} color="#00A63E" /> },
  { id: 1, label: "Saída", icon: <ArrowIcon style={{ transform: "rotate(-90deg)" }} width={16} height={16} color="#155DFC" /> },
  { id: 2, label: "Perda", icon: <TrashIcon width={16} height={16} color="#E7000B" /> },
  { id: 3, label: "Ajuste", icon: <EditIcon width={16} height={16} color="#9810FA" /> },
];

export default function NewMovementModal({ open, onClose }: NewMovementModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<IMovement>({
    resolver: yupResolver(movementSchema),
    defaultValues: {
      data: "",
      tipo: "entrada",
      item: mockCategorias[0].value,
      quantidade: 0,
      responsavel: "",
      justificativa: "",
    },
  });

  const onSubmit = (data: IMovement) => {
    console.log("Nova movimentação:", data);
    onClose();
  };

  const selectedTipo = watch("tipo");

  return (
    <Modal open={open} onClose={onClose} title="Nova Movimentação">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Box>
          <Typography variant="body2" mb={1} color="text.label" fontWeight={400}>
            Tipo de Movimentação
            <Typography variant="body2" component="span" color="primary.main" ml={.3}>*</Typography>
          </Typography>
          <Box display="grid" gap={1} gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))">
            {movementTypeItems.map((item) => (
              <Card
                key={item.id}
                alignItems="center"
                justifyContent="center"
                paddingY={1}
                spacing={1}
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  border: "2px solid",
                  borderColor: selectedTipo === item.label.toLowerCase() ? "primary.main" : "divider",
                  backgroundColor: selectedTipo === item.label.toLowerCase() ? "#FFE9E3" : "",
                  "&:hover":
                  {
                    boxShadow: 3,
                    transform: "translateY(-2px)",
                  },
                }}
                onClick={() => setValue("tipo", item.label.toLowerCase())}
              >
                {item.icon}
                <Typography variant="body2">{item.label}</Typography>
              </Card>
            ))}
          </Box>
          {errors.tipo && <Typography variant="caption" color="error">{errors.tipo.message}</Typography>}
        </Box>

        <Select
          label="Item"
          optional={false}
          options={mockCategorias}
          register={register("item")}
          error={errors.item?.message}
        />

        <Input
          label="Quantidade"
          placeholder="0"
          type="number"
          optional={false}
          sx={{ flex: 1 }}
          register={register("quantidade")}
          error={errors.quantidade?.message}
        />

        <Input
          label="Responsável"
          placeholder="Nome do responsável"
          optional={false}
          sx={{ flex: 1 }}
          register={register("responsavel")}
          error={errors.responsavel?.message}
        />

        <Box>
          <Input
            label="Justificativa"
            placeholder="Descreva o motivo da perda ou ajuste..."
            optional={selectedTipo === "perda" || selectedTipo === "ajuste" ? false : true}
            sx={{ flex: 1 }}
            register={register("justificativa")}
            error={errors.justificativa?.message}
          />

          <Typography variant="caption" color="text.secondary">
            Obrigatório para perdas e ajustes de estoque
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" border={"1px solid #BEDBFF"} borderRadius={3} padding={2} gap={2} sx={{ backgroundColor: "#EFF6FF" }} >
          <CircledCheckIcon color="#155DFC" />
          <Box>
            <Typography variant="body1" color="#1C398E">
              Atualização Automática de Saldo
            </Typography>
            <Typography variant="body2" color="#1447E6">
              O saldo será atualizado automaticamente.
            </Typography>
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
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            sx={{ flex: 1 }}
            variant="contained"
            type="submit"
          >
            Registrar Movimentação
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
