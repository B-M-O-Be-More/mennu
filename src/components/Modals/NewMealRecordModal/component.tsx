"use client";

import { Box, Button, Stack, useTheme } from "@mui/material";
import Modal from "../Modal";
import { NewMealRecordModalProps } from "./interface";
import Select from "@/components/FormControl/Select";
import { AutocompleteUser } from "@/components/FormControl/AutocompleteUser";
import TextArea from "@/components/FormControl/TextArea";
import { MealRecordInput, mealRecordSchema } from "@/schemas/mealRecordSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ClosableAlertBox from "@/components/ClosableAlertBox";
import { ErrorOutlineIcon } from "@/components/Icons";
import DatePicker from "@/components/FormControl/DatePicker";
import TimePicker from "@/components/FormControl/TimePicker";
import { Alert } from "@mui/material";
import React from "react";
import { useDebounce } from "@/hooks/useDebounce/hook";


interface ApiUser {
  id: number;
  nome?: string | null;
  matricula?: string | null;
}

interface ApiCardapio {
  id: number;
  tipo_refeicao_nome?: string;
  data_refeicao?: string;
}

const SELECT_PLACEHOLDER_VALUE = "__select__";
const SELECT_LOADING_VALUE = "__loading__";
const SELECT_NO_RESULTS_VALUE = "__no_results__";
const SELECT_START_SEARCH_VALUE = "__start_search__";

function dedupeOptions(options: { label: string; value: string }[]) {
  return Array.from(new Map(options.map((option) => [option.value, option])).values());
}

function normalizeUsers(payload: unknown): ApiUser[] {
  if (Array.isArray(payload)) return payload as ApiUser[];

  if (payload && typeof payload === "object") {
    const root = payload as { results?: unknown; data?: unknown };

    if (Array.isArray(root.results)) return root.results as ApiUser[];

    if (root.data && typeof root.data === "object") {
      const data = root.data as { results?: unknown };
      if (Array.isArray(data.results)) return data.results as ApiUser[];
    }
  }

  return [];
}

function normalizeCardapios(payload: unknown): ApiCardapio[] {
  if (Array.isArray(payload)) return payload as ApiCardapio[];

  if (payload && typeof payload === "object") {
    const root = payload as { results?: unknown; data?: unknown };

    if (Array.isArray(root.results)) return root.results as ApiCardapio[];

    if (root.data && typeof root.data === "object") {
      const data = root.data as { results?: unknown };
      if (Array.isArray(data.results)) return data.results as ApiCardapio[];
    }
  }

  return [];
}

export function NewMealRecordModal({
  isOpen,
  onClose,
  onSuccess,
  onNotify,
}: NewMealRecordModalProps) {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);
  const [isLoadingCardapios, setIsLoadingCardapios] = React.useState(false);
  const [userSearch, setUserSearch] = React.useState("");
  const [userOptions, setUserOptions] = React.useState<{ label: string; value: string; disabled?: boolean }[]>([
    { label: "Selecione um usuário", value: SELECT_PLACEHOLDER_VALUE },
  ]);
  const [mealTypeOptions, setMealTypeOptions] = React.useState<
    { label: string; value: string }[]
  >([{ label: "Selecione um cardápio", value: SELECT_PLACEHOLDER_VALUE }]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(mealRecordSchema),
    defaultValues: {
      user: SELECT_PLACEHOLDER_VALUE,
      mealType: SELECT_PLACEHOLDER_VALUE,
      date: null,
      time: null,
      reason: "",
    },
  });
  const debouncedUserSearch = useDebounce(userSearch ?? "", 400);


  const mealTypeSelectOptions = React.useMemo(() => {
    const hasRealCardapios = mealTypeOptions.some(
      (option) => option.value !== SELECT_PLACEHOLDER_VALUE,
    );

    if (isLoadingCardapios) {
      return [
        { label: "Selecione um cardápio", value: SELECT_PLACEHOLDER_VALUE },
        { label: "Carregando cardápios...", value: "__loading_cardapio__", disabled: true },
      ];
    }

    if (!hasRealCardapios) {
      return [
        { label: "Selecione um cardápio", value: SELECT_PLACEHOLDER_VALUE },
        { label: "Nenhum cardápio disponível", value: "__no_cardapio__", disabled: true },
      ];
    }

    return mealTypeOptions;
  }, [isLoadingCardapios, mealTypeOptions]);

  const loadUsers = React.useCallback(async (search: string) => {
    setIsLoadingUsers(true);

    try {
      const query = search.trim();
      const usersResponse = await fetch(
        query ? `/api/usuarios?busca=${encodeURIComponent(query)}` : "/api/usuarios",
      );

      if (!usersResponse.ok) {
        const errData = await usersResponse
          .json()
          .catch(() => ({ message: "Erro ao carregar usuários" }));
        throw new Error(errData.message ?? "Erro ao carregar usuários");
      }

      const usersPayload = await usersResponse.json();
      const users = normalizeUsers(usersPayload);

      const nextUserOptions = dedupeOptions([
        { label: "Selecione um usuário", value: SELECT_PLACEHOLDER_VALUE },
        ...users.map((user) => ({
          value: String(user.id),
          label: user.matricula
            ? `${user.nome ?? `Usuário ${user.id}`} (${user.matricula})`
            : (user.nome ?? `Usuário ${user.id}`),
        })),
      ]);

      setUserOptions(nextUserOptions);

      const selectedUser = getValues("user");
      const stillValid = nextUserOptions.some((option) => option.value === selectedUser);
      if (!stillValid) {
        setValue("user", SELECT_PLACEHOLDER_VALUE, { shouldValidate: true });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar usuários";
      setError(message);
      onNotify?.(message, "error");
    } finally {
      setIsLoadingUsers(false);
    }
  }, [getValues, onNotify, setValue]);

  const loadCardapios = React.useCallback(async () => {
    setIsLoadingCardapios(true);

    try {
      const cardapiosResponse = await fetch("/api/cardapio");

      if (!cardapiosResponse.ok) {
        const errData = await cardapiosResponse
          .json()
          .catch(() => ({ message: "Erro ao carregar cardápios" }));
        throw new Error(errData.message ?? "Erro ao carregar cardápios");
      }

      const cardapiosPayload = await cardapiosResponse.json();
      const cardapios = normalizeCardapios(cardapiosPayload);

      setMealTypeOptions(dedupeOptions([
        { label: "Selecione um cardápio", value: SELECT_PLACEHOLDER_VALUE },
        ...cardapios.map((cardapio) => ({
          value: String(cardapio.id),
          label: cardapio.data_refeicao
            ? `${cardapio.tipo_refeicao_nome ?? "Cardápio"} (${cardapio.data_refeicao})`
            : (cardapio.tipo_refeicao_nome ?? `Cardápio #${cardapio.id}`),
        })),
      ]));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar cardápios";
      setError(message);
      onNotify?.(message, "error");
    } finally {
      setIsLoadingCardapios(false);
    }
  }, [onNotify]);

  React.useEffect(() => {
    if (!isOpen) return;

    setError(null);
    reset({
      user: SELECT_PLACEHOLDER_VALUE,
      mealType: SELECT_PLACEHOLDER_VALUE,
      date: null,
      time: null,
      reason: "",
    });
    setUserSearch("");

    loadCardapios();
    loadUsers("");
  }, [isOpen, loadCardapios, loadUsers, reset]);

  React.useEffect(() => {
    if (!isOpen) return;

    loadUsers(debouncedUserSearch);
  }, [debouncedUserSearch, isOpen, loadUsers]);

  async function onSubmit(data: MealRecordInput) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        usuario_id: Number(data.user),
        cardapio_id: Number(data.mealType),
        motivo: data.reason,
      };

      const response = await fetch("/api/refeicao/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao registrar refeição manual" }));
        throw new Error(errData.message ?? "Erro ao registrar refeição manual");
      }

      onNotify?.("Registro manual criado com sucesso", "success");
      onSuccess?.();
      reset();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro desconhecido ao registrar refeição manual";
      setError(message);
      onNotify?.(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      title={"Registro Manual de Refeição"}
      open={isOpen}
      onClose={onClose}>
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        {error && <Alert severity="error">{error}</Alert>}

        <ClosableAlertBox
          severity="warning"
          icon={<ErrorOutlineIcon color={theme.palette.warning.contrastText} />}
          title="Registro Excepcional"
          description='Use este recurso apenas em casos excepcionais, como falha no terminal. O registro será marcado como "Manual" e auditado.'
        />

        <AutocompleteUser
          name="user"
          control={control}
          label="Usuário"
          error={errors.user?.message}
        />

        <Select
          label={"Cardápio"}
          optional={false}
          options={mealTypeSelectOptions}
          name="mealType"
          control={control}
          error={errors.mealType?.message}
        />

        <Stack direction={"row"} gap={1} justifyContent={"space-between"}>
          <Box width={"50%"}>
            <DatePicker label={"Data"} name={"date"} control={control} />
          </Box>

          <Box width={"50%"}>
            <TimePicker label="Horário" control={control} name={"time"} />
          </Box>
        </Stack>

        <TextArea
          label={"Motivo"}
          sublabel="(obrigatório para auditoria)"
          placeholder="Ex: Terminal fora do ar, problema técnico, exceção autorizada..."
          optional={false}
          register={register("reason")}
          error={errors.reason?.message}
        />

        <Stack direction="row" gap={2} justifyContent={"space-between"}>
          <Button variant="outlined" sx={{ flex: 1 }} onClick={onClose}>
            Cancelar
          </Button>
          <Button sx={{ flex: 1 }} variant="contained" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar Registro"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
