import { Stack, Button, useTheme, Box, IconButton, Tooltip, Typography } from "@mui/material";
import { TransferStockModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import ClosableAlertBox from "@/components/ClosableAlertBox";
import { CircledCheckIcon, AlertIcon, PlusIcon, TrashIcon } from "@/components/Icons";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { transferStockSchema, TransferStockSchemaFormData } from "@/schemas/transferStockSchema";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useInsumoOptions } from "@/hooks/useInsumoOptions/hook";
import { useUser } from "@/context/AuthContext";
import { mapApiSaldoEstoqueConsolidado } from "@/Interfaces/Stock/saldoEstoque";
import { formatAuditQuantity, toAuditNumber } from "@/utils/stockAuditUtils";
import React from "react";

const EMPTY_MOVIMENTACAO = { insumoId: "", quantidade: 0 };

export default function TransferStockModal({ open, onClose, onSave }: TransferStockModalProps) {
  const theme = useTheme();
  const { activeContext } = useUser();
  const { unitOptions } = useUnitFilterOptions();
  const { insumoOptions, unidadeMedidaByInsumoId } = useInsumoOptions();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  // `null` enquanto o saldo não carregou (ou falhou): sem ele não dá para
  // dizer que a quantidade excede nada.
  const [saldoPorInsumoId, setSaldoPorInsumoId] = React.useState<
    Record<string, number> | null
  >(null);

  const destinoOptions = unitOptions.filter(
    (option) => option.value !== "all" && option.value !== String(activeContext?.unidade_id ?? ""),
  );

  const {
    handleSubmit,
    register,
    control,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<TransferStockSchemaFormData>({
    resolver: yupResolver(transferStockSchema),
    defaultValues: {
      unidadeDestinoId: "",
      movimentacoes: [EMPTY_MOVIMENTACAO],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "movimentacoes",
  });

  const movimentacoes = watch("movimentacoes");

  // O saldo que limita a transferência é o da unidade de origem — a ativa, que
  // a API infere do contexto da requisição. Recarrega a cada abertura porque o
  // estoque muda enquanto a tela fica aberta.
  React.useEffect(() => {
    const unidadeId = activeContext?.unidade_id;
    if (!open || !unidadeId) return;

    let ativo = true;

    const loadSaldo = async () => {
      try {
        const response = await fetch(`/api/saldo-estoque/unidade/${unidadeId}`);
        if (!response.ok) throw new Error("Erro ao carregar saldo da unidade");

        const payload = await response.json();
        if (!ativo) return;

        const saldos = (Array.isArray(payload) ? payload : []).map(
          mapApiSaldoEstoqueConsolidado,
        );

        setSaldoPorInsumoId(
          Object.fromEntries(
            saldos.map((saldo) => [
              String(saldo.insumoId),
              toAuditNumber(saldo.quantidade) ?? 0,
            ]),
          ),
        );
      } catch {
        if (ativo) setSaldoPorInsumoId(null);
      }
    };

    loadSaldo();

    return () => {
      ativo = false;
    };
  }, [open, activeContext?.unidade_id]);

  // Cada insumo entra uma vez só na transferência: o que já foi escolhido em
  // outra linha fica desabilitado nas demais.
  const getItemOptions = (index: number) => {
    const jaEscolhidos = new Set(
      (movimentacoes ?? [])
        .map((movimentacao, movimentacaoIndex) =>
          movimentacaoIndex === index ? "" : movimentacao?.insumoId,
        )
        .filter(Boolean),
    );

    return [
      { label: "Selecione um item", value: "" },
      ...insumoOptions.map((option) => ({
        ...option,
        disabled: jaEscolhidos.has(option.value),
      })),
    ];
  };

  const getUnidadeMedida = (index: number) =>
    unidadeMedidaByInsumoId[movimentacoes?.[index]?.insumoId ?? ""] ?? "";

  // Insumo sem linha no saldo da unidade está zerado ali, não "desconhecido".
  const getSaldoExcedidoError = (
    insumoId?: string,
    quantidade?: number | string,
  ) => {
    if (saldoPorInsumoId === null || !insumoId) return undefined;

    const disponivel = saldoPorInsumoId[insumoId] ?? 0;
    const valor = Number(quantidade);
    if (!Number.isFinite(valor) || valor <= disponivel) return undefined;

    return `Maior que o disponível na unidade (${formatAuditQuantity(
      disponivel,
      unidadeMedidaByInsumoId[insumoId],
    )})`;
  };

  const onSubmit = async (data: TransferStockSchemaFormData) => {
    const linhasExcedidas = data.movimentacoes
      .map((movimentacao, index) => ({
        index,
        erro: getSaldoExcedidoError(movimentacao.insumoId, movimentacao.quantidade),
      }))
      .filter((linha) => linha.erro);

    if (linhasExcedidas.length > 0) {
      linhasExcedidas.forEach(({ index, erro }) =>
        setError(`movimentacoes.${index}.quantidade`, {
          type: "manual",
          message: erro,
        }),
      );
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/movimentacao-estoque/transferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unidade_destino_id: Number(data.unidadeDestinoId),
          movimentacoes: data.movimentacoes.map((movimentacao) => ({
            insumo_id: Number(movimentacao.insumoId),
            quantidade: movimentacao.quantidade,
          })),
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

        <Stack gap={1}>
          <Typography variant="body2" color="text.label" fontWeight={400}>
            Itens{" "}
            <Typography variant="body2" component="span" color="primary.main">
              *
            </Typography>
          </Typography>

          {fields.map((field, index) => {
            const movimentacao = movimentacoes?.[index];
            const quantidadeError =
              errors.movimentacoes?.[index]?.quantidade?.message ??
              getSaldoExcedidoError(movimentacao?.insumoId, movimentacao?.quantidade);

            return (
              <Stack
                key={field.id}
                direction={{ xs: "column", sm: "row" }}
                gap={1}
                alignItems={{ sm: "flex-start" }}
              >
                <Select
                  options={getItemOptions(index)}
                  name={`movimentacoes.${index}.insumoId`}
                  control={control}
                  error={errors.movimentacoes?.[index]?.insumoId?.message}
                  formControlSx={{ flex: 1 }}
                />

                <Box width={{ xs: "100%", sm: 160 }}>
                  <Input
                    placeholder="Quantidade"
                    type="number"
                    register={register(`movimentacoes.${index}.quantidade`)}
                    error={quantidadeError}
                    suffix={getUnidadeMedida(index) || undefined}
                  />
                </Box>

                <Box sx={{ alignSelf: { xs: "flex-end", sm: "auto" }, mt: { sm: 1.5 } }}>
                  <Tooltip title="Remover item">
                    <span>
                      <IconButton
                        aria-label="remover-item"
                        size="small"
                        disabled={fields.length === 1 || isSubmitting}
                        onClick={() => remove(index)}
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          color: "text.secondary",
                        }}
                      >
                        <TrashIcon width={20} height={20} />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              </Stack>
            );
          })}

          {typeof errors.movimentacoes?.message === "string" && (
            <Typography variant="caption" color="error.contrastText">
              {errors.movimentacoes.message}
            </Typography>
          )}

          <Button
            variant="outlined"
            startIcon={<PlusIcon />}
            onClick={() => append(EMPTY_MOVIMENTACAO)}
            disabled={isSubmitting}
            sx={{ alignSelf: "flex-start", fontWeight: 400 }}
          >
            Adicionar item
          </Button>
        </Stack>

        <ClosableAlertBox
          severity="info"
          icon={<CircledCheckIcon color={theme.palette.info.contrastText} />}
          title="Atualização Automática de Saldo"
          description="O saldo será aumentado automaticamente."
        />

        <Stack direction={{ xs: "column-reverse", sm: "row" }} gap={2}>
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
