import { Stack, Typography, Box, Button } from "@mui/material";
import { mockCategorias, mockStatuses, mockUnidades, mockUnidadesMedida } from "@/data/menuItems";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { IUser } from "@/data/tableColumns";
import { EditUserModalProps } from "./";
import { CircledCheckIcon } from "@/components/Icons";
import { useForm } from "react-hook-form";
import { userSchema } from "@/schemas/userSchema";
import { yupResolver } from "@hookform/resolvers/yup";


export default function EditUserModal({
  open,
  onClose,
  user,
  onSave,
}: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>(
    {
      resolver: yupResolver(userSchema),
      defaultValues: user,
    });

  const onSubmit = (data: IUser) => {
    onSave(data);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Item de Estoque">
      <Stack gap={2} component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nome Completo"
          placeholder="João Silva"
          optional={false}
          register={register("nome")}
          error={errors.nome?.message}
        />

        <Stack direction="row" spacing={2}>
          <Input
            label="CPF"
            placeholder="12345678900"
            optional={false}
            sx={{ flex: 1 }}
            register={register("CPF")}
            error={errors.CPF?.message}
          />

          <Input
            label="Matrícula"
            placeholder="12345"
            optional={false}
            sx={{ flex: 1 }}
            register={register("matricula")}
            error={errors.matricula?.message}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Select
            label="Categoria"
            optional={false}
            options={mockCategorias}
            register={register("categoria")}
            error={errors.categoria?.message}
          />

          <Select
            label="Unidade"
            optional={false}
            options={mockUnidades}
            register={register("unidade")}
            error={errors.unidade?.message}
          />
        </Stack>

        <Select
          label="Status"
          optional={true}
          options={mockStatuses}
          register={register("status")}
          error={errors.status?.message}
        />

        <Stack
          direction="row"
          border={"1px solid #BEDBFF"}
          borderRadius={3}
          padding={2}
          gap={2}
          sx={{
            backgroundColor: "#EFF6FF",
          }}
        >
          <CircledCheckIcon color="#155DFC" />
          <Box>
            <Typography variant="body1" color="#1C398E">Acesso aos Terminais</Typography>
            <Typography
              variant="body2"
              color="#1447E6">
              Este usuário poderá acessar os terminais de refeição da unidade selecionada. As políticas da unidade (horários e limites) serão aplicadas automaticamente.
            </Typography>
          </Box>
        </Stack>

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
          >
            Salvar Alterações
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
