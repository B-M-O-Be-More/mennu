"use client";

import Modal from "@/components/Modals/Modal";
import type { NewManualRegisterModalProps } from "./interface";
import Input from "@/components/FormControl/Input";
import { Alert, Button, Stack, useTheme } from "@mui/material";
import Select from "@/components/FormControl/Select";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ClosableAlertBox from "@/components/ClosableAlertBox";
import { AlertIcon } from "@/components/Icons";
import { createManualRegisterSchema, CreateManualRegisterSchemaFormData } from "@/schemas/menuSchema";
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
const SELECT_TYPE_TO_SEARCH_VALUE = "__type_to_search__";

function dedupeOptions(options: { label: string; value: string; disabled?: boolean }[]) {
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

export function NewManualRegisterModal({ open, onClose }: NewManualRegisterModalProps) {
  const theme = useTheme();
  const [isLoadingOptions, setIsLoadingOptions] = React.useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [userSearch, setUserSearch] = React.useState("");
  const [userOptions, setUserOptions] = React.useState<{ label: string; value: string }[]>([
    { label: "Selecione um usuário", value: SELECT_PLACEHOLDER_VALUE },
  ]);
  const [menuOptions, setMenuOptions] = React.useState<{ label: string; value: string }[]>([
    { label: "Selecione um tipo de cardápio", value: SELECT_PLACEHOLDER_VALUE },
  ]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<CreateManualRegisterSchemaFormData>({
    resolver: yupResolver(createManualRegisterSchema),
    defaultValues: {
      usuario: SELECT_PLACEHOLDER_VALUE,
      menu: SELECT_PLACEHOLDER_VALUE,
      motivo: "",
      restricoes: [],
    },
  });

  const debouncedUserSearch = useDebounce(userSearch, 400);
  const skipNextDebouncedLoadRef = React.useRef(false);

  const loadCardapios = React.useCallback(async () => {
    setIsLoadingOptions(true);
    setError(null);

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

      setMenuOptions(dedupeOptions([
        { label: "Selecione um tipo de cardápio", value: SELECT_PLACEHOLDER_VALUE },
        ...cardapios.map((cardapio) => ({
          value: String(cardapio.id),
          label: cardapio.data_refeicao
            ? `${cardapio.tipo_refeicao_nome ?? "Cardápio"} (${cardapio.data_refeicao})`
            : (cardapio.tipo_refeicao_nome ?? `Cardápio #${cardapio.id}`),
        })),
      ]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar cardápios");
      setMenuOptions([{ label: "Selecione um tipo de cardápio", value: SELECT_PLACEHOLDER_VALUE }]);
    } finally {
      setIsLoadingOptions(false);
    }
  }, [setError, setIsLoadingOptions, setMenuOptions, setUserOptions]);

  const loadUsers = React.useCallback(async (search: string) => {
    setIsLoadingUsers(true);
    setError(null);

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

      const selectedUser = getValues("usuario");
      const stillValid = nextUserOptions.some((option) => option.value === selectedUser);
      if (!stillValid) {
        setValue("usuario", SELECT_PLACEHOLDER_VALUE, { shouldValidate: true });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar usuários";
      setError(message);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [getValues, setValue]);

  const userSelectOptions = React.useMemo(() => {
    if (isLoadingUsers) {
      return [
        { label: "Selecione um usuário", value: SELECT_PLACEHOLDER_VALUE },
        { label: "Carregando usuários...", value: SELECT_LOADING_VALUE, disabled: true },
      ];
    }

    if (debouncedUserSearch.trim().length === 0 && userOptions.length <= 1) {
      return [
        { label: "Selecione um usuário", value: SELECT_PLACEHOLDER_VALUE },
        { label: "Digite para listar usuários", value: SELECT_TYPE_TO_SEARCH_VALUE, disabled: true },
      ];
    }

    if (debouncedUserSearch.trim().length > 0 && userOptions.length <= 1) {
      return [
        { label: "Selecione um usuário", value: SELECT_PLACEHOLDER_VALUE },
        { label: "Nenhum usuário encontrado", value: SELECT_NO_RESULTS_VALUE, disabled: true },
      ];
    }

    return userOptions;
  }, [debouncedUserSearch, isLoadingUsers, userOptions]);

  React.useEffect(() => {
    if (!open) return;

    reset({ usuario: SELECT_PLACEHOLDER_VALUE, menu: SELECT_PLACEHOLDER_VALUE, motivo: "", restricoes: [] });
    setUserSearch("");

    loadCardapios();
    loadUsers("");
    skipNextDebouncedLoadRef.current = true;
  }, [loadCardapios, loadUsers, open, reset]);

  React.useEffect(() => {
    if (!open) return;

    if (skipNextDebouncedLoadRef.current && debouncedUserSearch.trim().length === 0) {
      skipNextDebouncedLoadRef.current = false;
      return;
    }

    skipNextDebouncedLoadRef.current = false;
    loadUsers(debouncedUserSearch);
  }, [debouncedUserSearch, loadUsers, open]);

  async function onSubmit(data: CreateManualRegisterSchemaFormData) {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/refeicao/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: Number(data.usuario),
          cardapio_id: Number(data.menu),
          motivo: data.motivo,
        }),
      });

      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao registrar consumo manual" }));
        throw new Error(errData.message ?? "Erro ao registrar consumo manual");
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao registrar consumo manual");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Registrar Consumo Manual" subtitle="Para exceções e correções operacionais">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>

        {error && <Alert severity="error">{error}</Alert>}

        <Input
          label="Buscar Usuário"
          placeholder="Digite nome, matrícula ou CPF"
          value={userSearch}
          onChange={(event) => setUserSearch(event.target.value)}
        />

        <Select
          label={"Usuário"}
          options={userSelectOptions}
          name="usuario"
          control={control}
          error={errors.usuario?.message}
          selectSx={{ maxHeight: 320, overflowY: "auto" }}
        />

        <Select
          label={"Cardápio (Data + Tipo)"}
          optional={false}
          options={menuOptions}
          name="menu"
          control={control}
          error={errors.menu?.message}
        />

        <Input
          label="Motivo"
          placeholder="Ex: Sistema fora do ar"
          multiline
          register={register("motivo")}
          error={errors.motivo?.message}
        />

        <ClosableAlertBox
          severity="info"
          icon={
            <AlertIcon color={theme.palette.info.contrastText} />
          }
          title="Registro Excepcional"
          description='Use este recurso apenas em casos excepcionais, como falha no terminal. O registro será marcado como "Manual" e auditado.'
        />

        <Stack direction="row" gap={2} justifyContent={"space-between"}>
          <Button variant="outlined" sx={{ flex: 1 }} onClick={onClose}>
            Cancelar
          </Button>
          <Button sx={{ flex: 1 }} variant="contained" type="submit" disabled={isSubmitting || isLoadingOptions}>
            {isSubmitting ? "Registrando..." : "Registrar Consumo"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
