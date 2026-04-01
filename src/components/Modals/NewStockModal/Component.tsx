import { Stack, Typography, Box, Button, Switch, Alert } from "@mui/material";
import { mockUnidades, mockUnidadesMedida } from "../../../data/menuItems";
import { NewStockModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createStockSchema, CreateStockSchemaFormData } from "@/schemas/stockSchema";
import { useState } from "react";

export default function NewStockModal({ open, onClose }: NewStockModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateStockSchemaFormData>({
    resolver: yupResolver(createStockSchema),
    defaultValues: {
      nome: "",
      categoria: "",
      tipo_padrao: "",
      unidade_medida: mockUnidadesMedida[1].value, // Default to first real option
      ponto_reposicao: "",
      unidade_id: "",
    },
  });

  const onSubmit = async (data: CreateStockSchemaFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/insumo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar insumo');
      }

      // Success
      reset();
      onClose();
      // TODO: Refresh the list or notify parent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Novo Insumo">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={2}>
          {error && <Alert severity="error">{error}</Alert>}

          <Input
            label="Nome do Insumo"
            placeholder="Ex. Arroz Branco"
            optional={false}
            register={register("nome")}
            error={errors.nome?.message}
          />

          <Stack direction="row" spacing={2}>
            <Input
              label="Categoria"
              placeholder="Ex. Alimentos"
              optional={true}
              register={register("categoria")}
              error={errors.categoria?.message}
            />
            <Input
              label="Tipo Padrão"
              placeholder="Ex. Tipo A"
              optional={true}
              register={register("tipo_padrao")}
              error={errors.tipo_padrao?.message}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Select
              label="Unidade de Medida"
              optional={false}
              options={mockUnidadesMedida}
              register={register("unidade_medida")}
              error={errors.unidade_medida?.message}
            />
            <Input
              label="Ponto de Reposição"
              placeholder="0"
              optional={true}
              register={register("ponto_reposicao")}
              error={errors.ponto_reposicao?.message}
            />
          </Stack>

          <Select
            label="Unidade"
            optional={true}
            options={mockUnidades}
            register={register("unidade_id")}
            error={errors.unidade_id?.message}
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
              {loading ? "Criando..." : "Cadastrar Insumo"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Modal>
  );
}
