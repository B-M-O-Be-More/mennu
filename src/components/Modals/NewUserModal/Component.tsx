import { Stack, Typography, Button, useTheme } from "@mui/material";
import { mockStatuses } from "../../../data/menuItems";
import { NewUserModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { useForm, FieldErrors } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createUserSchema, CreateUserSchemaFormData } from "@/schemas/userSchema";
import ClosableAlertBox from "@/components/ClosableAlertBox";
import { UsuariosIcon } from "@/components/Icons";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useCargoOptions } from "@/hooks/useCargoOptions/hook";
import { getApiMessage } from "@/utils/apiMessage";
import React from "react";

/**
 * A criação devolve o usuário em formatos diferentes conforme o endpoint
 * (`{id}`, `{data:{id}}` ou `{results:[{id}]}`) — o id é o que permite
 * vincular o cargo logo em seguida.
 */
function extractCreatedUserId(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;

  const root = payload as {
    id?: unknown;
    data?: { id?: unknown };
    results?: unknown;
  };
  const firstResult = Array.isArray(root.results)
    ? (root.results[0] as { id?: unknown } | undefined)
    : (root.results as { id?: unknown } | undefined);

  for (const candidate of [root.id, root.data?.id, firstResult?.id]) {
    const id = Number(candidate);
    if (Number.isInteger(id) && id > 0) return id;
  }

  return null;
}

/**
 * Vincula o usuário recém-criado ao cargo escolhido. Devolve a mensagem de
 * erro em vez de lançar: o usuário já existe nesse ponto, então a falha aqui
 * é parcial e não pode ser tratada como falha do cadastro.
 */
async function linkUserToCargo(
  cargoId: string,
  userId: number | null,
): Promise<string | null> {
  if (!userId) {
    return "Usuário criado, mas a API não devolveu o id — vincule o cargo pela tela de Perfis & Permissões.";
  }

  try {
    const response = await fetch(`/api/cargos/${cargoId}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_ids: [userId] }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      return getApiMessage(
        payload,
        "Usuário criado, mas não foi possível vinculá-lo ao cargo.",
      );
    }

    return null;
  } catch {
    return "Usuário criado, mas não foi possível vinculá-lo ao cargo.";
  }
}

/**
 * A categoria saiu do formulário (quem define o acesso agora é o cargo), mas
 * continua no payload: os terminais filtram quem pode entrar por ela.
 */
const CATEGORIA_USUARIO_PADRAO = "FUNCIONARIO";

export default function NewUserModal({ open, onClose, onCreated, onNotify }: NewUserModalProps) {
  const theme = useTheme();
  const { unitOptions } = useUnitFilterOptions();
  const realUnitOptions = unitOptions.filter((option) => option.value !== "all");
  // Só busca os cargos quando o modal abre (o componente fica montado o tempo
  // todo na página de usuários).
  const { cargoOptions, isLoadingCargos, cargosError } = useCargoOptions(open);
  const cargoSelectOptions = React.useMemo(
    () => [
      {
        label: isLoadingCargos ? "Carregando cargos..." : "Selecione o cargo",
        value: "",
      },
      ...cargoOptions,
    ],
    [cargoOptions, isLoadingCargos],
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // A opção ausente no select não explica sozinha por que a lista veio vazia.
  React.useEffect(() => {
    if (cargosError) onNotify?.(cargosError, "error");
  }, [cargosError, onNotify]);

  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateUserSchemaFormData>({
    resolver: yupResolver(createUserSchema),
    defaultValues: {
      nome: "",
      documento: "",
      matricula: "",
      cargo_id: "",
      unidade_id: "",
      status: "false",
      password: "",
      numero_cartao: "",
      email: "",
      telefone: "",
    },
  });

  React.useEffect(() => {
    // Espelha o que o Select já mostra: sem valor no form, ele exibe a primeira
    // opção — sem esse seed, a tela mostraria uma unidade e o envio iria vazio.
    if (realUnitOptions.length > 0 && !getValues("unidade_id")) {
      setValue("unidade_id", realUnitOptions[0].value, { shouldValidate: false });
    }
  }, [realUnitOptions, getValues, setValue]);

  // Sem isto, o clique em "Criar" simplesmente não faz nada quando algum campo
  // é reprovado — o erro fica só embaixo do campo, fora da área visível de um
  // modal longo.
  const onInvalid = (formErrors: FieldErrors<CreateUserSchemaFormData>) => {
    const messages = Object.values(formErrors)
      .map((fieldError) => fieldError?.message)
      .filter((message): message is string => Boolean(message));

    onNotify?.(
      messages.length > 0
        ? messages.join(" · ")
        : "Revise os campos destacados antes de continuar.",
      "error",
    );
  };

  const onSubmit = async (data: CreateUserSchemaFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          documento: data.documento.replace(/\D/g, ""),
          matricula: data.matricula,
          unidade_id: Number(data.unidade_id),
          categoria_usuario: CATEGORIA_USUARIO_PADRAO,
          is_active: data.status === "true",
          password: data.password,
          numero_cartao: data.numero_cartao ? data.numero_cartao.replace(/\D/g, "") : undefined,
          email: data.email || undefined,
          telefone: data.telefone || undefined,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getApiMessage(payload, "Erro ao criar usuário"));
      }

      // O vínculo com o cargo é um segundo passo: `POST /cargos/{id}/usuarios`
      // é o endpoint que a tela de Perfis & Permissões já usa para isso.
      const cargoError = data.cargo_id
        ? await linkUserToCargo(data.cargo_id, extractCreatedUserId(payload))
        : null;

      // O usuário já existe neste ponto: o formulário é limpo e o modal fecha
      // mesmo com falha no vínculo — reenviar duplicaria o cadastro. O aviso
      // do vínculo fica mais tempo na tela por exigir uma ação manual depois.
      reset();
      onCreated();
      onClose();

      if (cargoError) {
        onNotify?.(cargoError, "warning", 8000);
      } else {
        onNotify?.(getApiMessage(payload, "Usuário criado com sucesso"), "success");
      }
    } catch (err) {
      onNotify?.(
        err instanceof Error ? err.message : "Erro ao criar usuário",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Novo Usuário">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <Input
          label="Nome Completo"
          placeholder="Ex. João Silva"
          optional={false}
          sx={{ flex: 1 }}
          register={register("nome")}
          error={errors.nome?.message}
        />

        <Stack direction="row" spacing={2}>
          <Input
            label="CPF"
            placeholder="Ex. 000.000.000-00"
            optional={false}
            sx={{ flex: 1 }}
            register={register("documento")}
            error={errors.documento?.message}
          />

          <Input
            label="Matrícula"
            placeholder="Ex. 123456"
            optional={false}
            sx={{ flex: 1 }}
            register={register("matricula")}
            error={errors.matricula?.message}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Select
            label="Cargo"
            options={cargoSelectOptions}
            name="cargo_id"
            control={control}
            disabled={isLoadingCargos}
            error={errors.cargo_id?.message ?? cargosError ?? undefined}
          />

          <Select
            label="Unidade"
            optional={false}
            options={realUnitOptions}
            name="unidade_id"
            control={control}
            error={errors.unidade_id?.message}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Select
            label="Status"
            options={mockStatuses}
            name="status"
            control={control}
            error={errors.status?.message}
          />

          <Input
            label="Número do Cartão"
            placeholder="Ex: 1250458-25"
            sx={{ flex: 1 }}
            register={register("numero_cartao")}
            error={errors.numero_cartao?.message}
          />
        </Stack>

        <Input
          label="Senha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          optional={false}
          register={register("password")}
          error={errors.password?.message}
        />

        <Stack direction="row" spacing={2}>
          <Input
            label="E-mail"
            placeholder="Ex. joao.silva@email.com"
            sx={{ flex: 1 }}
            register={register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Telefone"
            placeholder="Ex. (00) 00000-0000"
            sx={{ flex: 1 }}
            register={register("telefone")}
            error={errors.telefone?.message}
          />
        </Stack>

        <Typography variant="body2" color="text.secondary" fontWeight={400}>
          Usuários inativos não podem acessar o terminal de refeições
        </Typography>

        <ClosableAlertBox
          severity="info"
          icon={
            <UsuariosIcon color={theme.palette.info.contrastText} />
          }
          title="Acesso aos Terminais"
          description="Este usuário poderá acessar os terminais de refeição da unidade selecionada. As políticas da unidade (horários e limites) serão aplicadas automaticamente."
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
          >
            Cancelar
          </Button>
          <Button
            sx={{ flex: 1 }}
            variant="contained"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Criando..." : "Criar Novo Usuário"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
