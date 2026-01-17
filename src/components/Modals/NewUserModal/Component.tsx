import React from "react";
import { Stack, Typography, Box, Button } from "@mui/material";
import { UsuariosIcon } from "../../Sidebar/icons";
import { mockCategorias, mockUnidades, mockStatuses } from "../../../data/menuItems";
import { NewUserModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { useForm } from "react-hook-form";
import { IUser } from "@/data/tableColumns";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "@/schemas/userSchema";

export default function NewUserModal({ open, onClose }: NewUserModalProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IUser>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      nome: "",
      CPF: "",
      matricula: "",
      categoria: mockCategorias[0].value,
      unidade: mockUnidades[0].value,
      status: mockStatuses[0].value,
      numeroCartao: "",
    },
  });

  const onSubmit = (data: IUser) => { console.log("Novo usuário:", data); onClose(); };

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
            register={register("CPF")}
            error={errors.CPF?.message}
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
            options={mockCategorias}
            register={register("categoria")}
            error={errors.categoria?.message}
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
            register={register("numeroCartao")}
            error={errors.numeroCartao?.message}
          />
        </Stack>

        <Typography variant="body2" color="text.secondary" fontWeight={400}>
          Usuários inativos não podem acessar o terminal de refeições
        </Typography>

        <Stack direction={"row"} border={"1px solid #BEDBFF"} bgcolor={"#EFF6FF"} borderRadius={2} p={2} gap={1}>
          <UsuariosIcon color="#155DFC" />
          <Box>
            <Typography variant="h5" fontWeight={"400"} color="#1C398E" mb={1}>
              Acesso aos Terminais
            </Typography>
            <Typography variant="body2" color="#1447E6" fontWeight={400}>
              Este usuário poderá acessar os terminais de refeição da unidade selecionada. As políticas da unidade (horários e limites) serão aplicadas automaticamente.
            </Typography>
          </Box>
        </Stack>
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
