import React, { useState } from "react";
import { Stack, Button, Alert, IconButton, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { unidadesMedidaOptions } from "@/data/menuItems";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import CreatableCategorySelect from "@/components/FormControl/CreatableCategorySelect";
import { EditStockModalProps } from "./interface";
import { useForm, type Resolver } from "react-hook-form";
import { createStockSchema } from "@/schemas/stockSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type StockFormData = yup.Asserts<typeof createStockSchema>;

export default function EditStockModal({
  open,
  onClose,
  stockItem,
  onSave,
}: EditStockModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<StockFormData>({
    resolver: yupResolver(createStockSchema) as Resolver<StockFormData>,
    defaultValues: {
      nome: "",
      categoria: "",
      tipo_padrao: "",
      unidade_medida: "kg",
      ponto_reposicao: 0,
      quantidade_atual: 0,
    },
  });

  React.useEffect(() => {
    if (!open || !stockItem) return;

    reset({
      nome: stockItem.nome,
      categoria: stockItem.categoria ?? "",
      tipo_padrao: stockItem.tipo_padrao ?? "",
      unidade_medida: stockItem.unidade_medida,
      ponto_reposicao: Number(stockItem.ponto_reposicao) || 0,
      quantidade_atual: Number(stockItem.quantidade_atual) || 0,
    });
  }, [open, stockItem, reset]);

  const onSubmit = async (data: StockFormData) => {
    setLoading(true);
    setError(null);

    try {
      const payload: {
        nome: string;
        unidade_medida: StockFormData["unidade_medida"];
        ponto_reposicao: number;
        quantidade_atual: number;
        categoria?: string;
        tipo_padrao?: string;
      } = {
        nome: data.nome,
        unidade_medida: data.unidade_medida,
        ponto_reposicao: Number(data.ponto_reposicao),
        quantidade_atual: Number(data.quantidade_atual),
      };

      const categoria = data.categoria?.trim();
      const tipoPadrao = data.tipo_padrao?.trim();

      if (categoria) {
        payload.categoria = categoria;
      }

      if (tipoPadrao) {
        payload.tipo_padrao = tipoPadrao;
      }

      const response = await fetch(`/api/insumo/${stockItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Já existe um insumo com este nome. Escolha um nome diferente.');
        }
        if (response.status === 401) {
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        if (response.status === 422) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Dados inválidos. Verifique os campos.');
        }
        if (response.status >= 500) {
          throw new Error('Erro no servidor. Tente novamente mais tarde.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar insumo');
      }

      // Success
      onSave?.({
        nome: payload.nome,
        categoria: payload.categoria ?? null,
        tipo_padrao: payload.tipo_padrao ?? null,
        unidade_medida: payload.unidade_medida,
        ponto_reposicao: String(payload.ponto_reposicao),
        quantidade_atual: String(payload.quantidade_atual),
      });
      onClose();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMsg);
      console.error('Erro ao atualizar insumo:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Insumo">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        {error && <Alert severity="error">{error}</Alert>}

        <Input
          label="Nome do Insumo"
          placeholder="Ex. Arroz Branco"
          optional={false}
          register={register("nome")}
          error={errors.nome?.message}
        />
        <Stack direction="row" spacing={2}>
          <CreatableCategorySelect
            name="categoria"
            control={control}
            enabled={open}
            optional={false}
            error={errors.categoria?.message}
          />

          <Input
            label="Tipo Padrão"
            placeholder="Ex. Caixa, Saco, Fardo"
            optional={true}
            register={register("tipo_padrao")}
            error={errors.tipo_padrao?.message}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Select
            label="Unidade de Medida"
            optional={false}
            options={unidadesMedidaOptions}
            control={control}
            name="unidade_medida"
            error={errors.unidade_medida?.message}
          />
          <Input
            label="Ponto de Reposição"
            labelIcon={
              <Tooltip
                title="Quantidade indicativa para iniciar reposição."
                arrow
              >
                <IconButton
                  size="small"
                  aria-label="Informação sobre o ponto de reposição"
                  sx={{ p: 0, color: "text.secondary" }}
                >
                  <InfoOutlinedIcon />
                </IconButton>
              </Tooltip>
            }
            placeholder="0"
            optional={true}
            register={register("ponto_reposicao")}
            error={errors.ponto_reposicao?.message}
          />
        </Stack>

        <Input
          label="Quantidade Atual"
          type="number"
          placeholder="0"
          optional={false}
          register={register("quantidade_atual")}
          error={errors.quantidade_atual?.message}
        />

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
            disabled={loading}
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
            disabled={loading}
          >
            {loading ? "Atualizando..." : "Salvar Alterações"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
