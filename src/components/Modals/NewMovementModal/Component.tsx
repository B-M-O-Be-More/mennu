import { Stack, Typography, Box, Button, useTheme } from "@mui/material";
import { mockTipoUsuario } from "../../../data/menuItems";
import { NewMovementModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { ArrowIcon, CircledCheckIcon, EditIcon, TrashIcon } from "@/components/Icons";
import { Card } from "@/components/Cards/Card/Component";
import { useForm } from "react-hook-form";
import { createMovementSchema, CreateMovementSchemaFormData } from "@/schemas/movementSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import ClosableAlertBox from "@/components/ClosableAlertBox/Component";
import { useState } from "react";

const movementTypeItems = [
  { id: 0, label: "Entrada", icon: <ArrowIcon style={{ transform: "rotate(90deg)" }} width={16} height={16} color="#00A63E" /> },
  { id: 1, label: "Saída", icon: <ArrowIcon style={{ transform: "rotate(-90deg)" }} width={16} height={16} color="#155DFC" /> },
  { id: 2, label: "Perda", icon: <TrashIcon width={16} height={16} color="#E7000B" /> },
  { id: 3, label: "Ajuste", icon: <EditIcon width={16} height={16} color="#9810FA" /> },
];

export default function NewMovementModal({ open, onClose, onSave }: NewMovementModalProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateMovementSchemaFormData>({
    resolver: yupResolver(createMovementSchema),
    defaultValues: {
      data: "",
      tipo: "entrada",
      item: mockTipoUsuario[0].value,
      quantidade: 0,
      responsavel: "",
      justificativa: "",
    },
  });

  const onSubmit = async (data: CreateMovementSchemaFormData) => {
    setLoading(true);
    setError(null);

    try {
      const parsedInsumoId = Number(data.item);
      const payload = {
        insumo_id: Number.isFinite(parsedInsumoId) ? parsedInsumoId : 0,
        tipo: data.tipo,
        quantidade: Number(data.quantidade),
        motivo: data.responsavel,
        justificativa: data.justificativa || "",
        unidade_id: 0,
      };

      const response = await fetch("/api/movimentacao-estoque", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Sessão expirada. Faça login novamente.");
        }
        if (response.status === 403) {
          throw new Error("Você não tem permissão para registrar movimentações.");
        }
        if (response.status === 422) {
          const errorData = await response.json().catch(() => ({ message: "Dados inválidos." }));
          throw new Error(errorData.message || "Dados inválidos.");
        }
        if (response.status >= 500) {
          throw new Error("Erro no servidor. Tente novamente mais tarde.");
        }

        const errorData = await response.json().catch(() => ({ message: "Erro ao registrar movimentação." }));
        throw new Error(errorData.message || "Erro ao registrar movimentação.");
      }

      onSave?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const selectedTipo = watch("tipo");

  return (
    <Modal open={open} onClose={onClose} title="Nova Movimentação">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        {error && <ClosableAlertBox severity="error" title="Erro" description={error} />}

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
                onClick={() =>
                  setValue(
                    "tipo",
                    item.label.toLowerCase() as "entrada" | "saida" | "perda" | "ajuste"
                  )
                }
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
          options={mockTipoUsuario}
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

        <ClosableAlertBox
          severity="info"
          icon={
            <CircledCheckIcon color={theme.palette.info.contrastText} />
          }
          title="Atualização Automática de Saldo"
          description=' O saldo será atualizado automaticamente.'
        />

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
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            sx={{ flex: 1 }}
            variant="contained"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar Movimentação"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
