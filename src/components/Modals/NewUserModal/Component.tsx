import { Stack, Typography, Box, Button, useTheme } from "@mui/material";
import { UsuariosIcon } from "../../Sidebar/icons";
import { mockTipoUsuario, mockUnidades, mockStatuses } from "../../../data/menuItems";
import { NewUserModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createUserSchema, CreateUserSchemaFormData } from "@/schemas/userSchema";
import ClosableAlertBox from "@/components/ClosableAlertBox";

export default function NewUserModal({ open, onClose }: NewUserModalProps) {
  const theme = useTheme();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateUserSchemaFormData>({
    resolver: yupResolver(createUserSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      matricula: "",
      tipo_usuario: "funcionario",
      unidade: mockUnidades[0].value,
      status: "false",
      numero_cartao: "",
    },
  });

  const onSubmit = (data: CreateUserSchemaFormData) => {
    const newUser = { ...data, status: data.status === "true" ? true : false };

    console.log(newUser);

    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Novo Usuário">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
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
            register={register("cpf")}
            error={errors.cpf?.message}
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
            label="Categoria"
            options={mockTipoUsuario}
            register={register("tipo_usuario")}
            error={errors.tipo_usuario?.message}
          />

          <Select
            label="Unidade"
            options={mockUnidades}
            register={register("unidade")}
            error={errors.unidade?.message}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Select
            label="Status"
            options={mockStatuses}
            register={register("status")}
            error={errors.status?.message}
          />

          <Input
            label="Número do Cartão"
            placeholder="Ex: 1250458-25"
            optional={false}
            sx={{ flex: 1 }}
            register={register("numero_cartao")}
            error={errors.numero_cartao?.message}
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
          >
            Criar Novo Usuário
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
