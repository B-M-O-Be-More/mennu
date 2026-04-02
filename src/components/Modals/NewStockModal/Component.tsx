import { Stack, Button, Alert } from "@mui/material";
import React from "react";
import { mockUnidadesMedida } from "../../../data/menuItems";
import { NewStockModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createStockSchema } from "@/schemas/stockSchema";
import { useState } from "react";
import * as yup from "yup";

type Unidade = {
  id: number;
  nome: string;
};

type StockFormData = yup.Asserts<typeof createStockSchema>;

export default function NewStockModal({ open, onClose }: NewStockModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    getValues,
    setValue,
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
    let isCancelled = false;

    const fetchUnidades = async () => {
      try {
        const response = (await fetch("/api/unidades", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json())) as { results?: Unidade[] };

        const options = response.results || [];

        if (!isCancelled) {
          setUnidades(options);
        }

        const currentUnidadeId = Number(getValues("unidade_id"));
        const hasUnidade = options.some((u) => u.id === currentUnidadeId);

        if (!isCancelled && !hasUnidade) {
          setValue("unidade_id", undefined, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setUnidades([]);
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
  }, [open, getValues, setValue]);

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
      

      const response = await fetch('/api/insumo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar insumo');
      }

      // Sucesso
      reset();
      onClose();
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
            placeholder="0"
            optional={false}
            register={register("quantidade_atual")}
            error={errors.quantidade_atual?.message}
          />

          {mounted && (
            <Select
              label="Unidade"
              optional={true}
              options={unidades.map((u) => ({ label: u.nome, value: String(u.id) }))}
              control={control}
              name="unidade_id"
              error={errors.unidade_id?.message}
            />
          )}

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
