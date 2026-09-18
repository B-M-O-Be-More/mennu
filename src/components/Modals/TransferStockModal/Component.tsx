import { Stack, Button, useTheme } from "@mui/material";
import { TransferStockModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import ClosableAlertBox from "@/components/ClosableAlertBox";
import { CircledCheckIcon, AlertIcon } from "@/components/Icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { transferStockSchema, TransferStockSchemaFormData } from "@/schemas/transferStockSchema";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useInsumoOptions } from "@/hooks/useInsumoOptions/hook";
import { useUser } from "@/context/AuthContext";
import React from "react";

export default function TransferStockModal({ open, onClose, onSave }: TransferStockModalProps) {
  const theme = useTheme();
  const { activeContext } = useUser();
  const { unitOptions } = useUnitFilterOptions();
  const { insumoOptions } = useInsumoOptions();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const destinoOptions = unitOptions.filter(
    (option) => option.value !== "all" && option.value !== String(activeContext?.unidade_id ?? ""),
  );

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<TransferStockSchemaFormData>({
    resolver: yupResolver(transferStockSchema),
    defaultValues: {
      unidadeDestinoId: "",
      insumoId: "",
      quantidade: 0,
    },
  });

  const onSubmit = async (data: TransferStockSchemaFormData) => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/movimentacao-estoque/transferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          insumo_id: Number(data.insumoId),
          unidade_destino_id: Number(data.unidadeDestinoId),
          quantidade: data.quantidade,
        }),
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ detail: "Erro ao transferir estoque" }));
        throw new Error(errData.detail ?? "Erro ao transferir estoque");
      }

      reset();
      onSave?.();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao transferir estoque");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Transferência de Estoque">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        {submitError && (
          <ClosableAlertBox
            severity="error"
            icon={<AlertIcon color={theme.palette.error.contrastText} />}
            title="Erro"
            description={submitError}
          />
        )}

        <Select
          label="Unidade"
          optional={false}
          options={[{ label: "Selecione a unidade", value: "" }, ...destinoOptions]}
          name="unidadeDestinoId"
          control={control}
          error={errors.unidadeDestinoId?.message}
        />

        <Select
          label="Item"
          optional={false}
          options={[{ label: "Selecione um item", value: "" }, ...insumoOptions]}
          name="insumoId"
          control={control}
          error={errors.insumoId?.message}
        />

        <Input
          label="Quantidade"
          placeholder="0"
          type="number"
          optional={false}
          register={register("quantidade")}
          error={errors.quantidade?.message}
        />

        <ClosableAlertBox
          severity="info"
          icon={<CircledCheckIcon color={theme.palette.info.contrastText} />}
          title="Atualização Automática de Saldo"
          description="O saldo será aumentado automaticamente."
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
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            sx={{ flex: 1 }}
            variant="contained"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Registrar Movimentação"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
