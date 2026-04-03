import React, { useState } from "react";
import { Stack, Button, Alert } from "@mui/material";
import { unidadesMedidaOptions } from "@/data/menuItems";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { EditStockModalProps } from "./interface";
import { useForm, type Resolver } from "react-hook-form";
import { createStockSchema } from "@/schemas/stockSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type Unidade = {
  id: number;
  nome: string;
};

type StockFormData = yup.Asserts<typeof createStockSchema>;

export default function EditStockModal({
  open,
  onClose,
  stockItem,
  onSave,
}: EditStockModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [unidadesError, setUnidadesError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm<StockFormData>({
    resolver: yupResolver(createStockSchema) as Resolver<StockFormData>,
    defaultValues: {
      nome: "",
      categoria: undefined,
      tipo_padrao: undefined,
      unidade_medida: "kg",
      ponto_reposicao: 0,
      unidade_id: undefined,
      quantidade_atual: 0,
    },
  });

  React.useEffect(() => {
    if (!open || !stockItem) return;

    reset({
      nome: stockItem.nome,
      categoria: stockItem.categoria ?? undefined,
      tipo_padrao: stockItem.tipo_padrao ?? undefined,
      unidade_medida: stockItem.unidade_medida,
      ponto_reposicao: Number(stockItem.ponto_reposicao) || 0,
      unidade_id: undefined,
      quantidade_atual: Number(stockItem.quantidade_atual) || 0,
    });
  }, [open, stockItem, reset]);

  React.useEffect(() => {
    if (!open || !stockItem || unidades.length === 0) return;

    const parsedUnidadeId = Number(stockItem.unidade_id);
    const hasUnidade = unidades.some((u) => u.id === parsedUnidadeId);

    setValue("unidade_id", hasUnidade ? parsedUnidadeId : undefined, {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [open, stockItem, unidades, setValue]);

  React.useEffect(() => {
    let isCancelled = false;

    const fetchUnidades = async () => {
      try {
        const response = await fetch("/api/unidades", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Sessão expirada. Faça login novamente."
              : "Erro ao carregar unidades. Tente novamente."
          );
        }

        const data = (await response.json()) as { results?: Unidade[] };

        if (!isCancelled) {
          setUnidades(data.results ?? []);
          setUnidadesError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          setUnidades([]);
          setUnidadesError(err instanceof Error ? err.message : "Erro ao carregar unidades");
        }
      }
    };

    if (open) {
      fetchUnidades();
    } else {
      setUnidades([]);
    }

    return () => {
      isCancelled = true;
    };
  }, [open]);

  const onSubmit = async (data: StockFormData) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        nome: data.nome,
        categoria: data.categoria || "",
        tipo_padrao: data.tipo_padrao || "",
        unidade_medida: data.unidade_medida,
        ponto_reposicao: Number(data.ponto_reposicao),
        unidade_id: data.unidade_id ? Number(data.unidade_id) : 0,
        quantidade_atual: Number(data.quantidade_atual),
      };

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
        categoria: payload.categoria,
        tipo_padrao: payload.tipo_padrao,
        unidade_medida: payload.unidade_medida,
        ponto_reposicao: String(payload.ponto_reposicao),
        unidade_id: payload.unidade_id || null,
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
        {unidadesError && <Alert severity="warning">{unidadesError}</Alert>}

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
            options={unidadesMedidaOptions}
            control={control}
            name="unidade_medida"
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

        <Input
          label="Quantidade Atual"
          type="number"
          placeholder="0"
          optional={false}
          register={register("quantidade_atual")}
          error={errors.quantidade_atual?.message}
        />

        <Select
          label="Unidade"
          optional={true}
          options={unidades.map((u) => ({ label: u.nome, value: String(u.id) }))}
          control={control}
          name="unidade_id"
          error={errors.unidade_id?.message}
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
