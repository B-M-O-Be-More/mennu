import React from "react";
import { Stack, Typography, Box, Button, Switch, Chip } from "@mui/material";
import { mockCategorias, mockStatuses, mockUnidades, mockUnidadesMedida } from "@/data/menuItems";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import { IUser } from "@/data/tableColumns";
import { EditUserModalProps } from "./";
import { CircledCheckIcon } from "@/components/Icons";


export default function EditUserModal({
  open,
  onClose,
  user,
  onSave,
}: EditUserModalProps) {
  const [nome, setNome] = React.useState(user.nome);
  const [CPF, setCPF] = React.useState(user.CPF);
  const [matricula, setMatricula] = React.useState(user.matricula);
  const [categoria, setCategoria] = React.useState(user.categoria);
  const [unidade, setUnidade] = React.useState(user.unidade);
  const [status, setStatus] = React.useState(user.status);


  const handleSave = () => {
    if (!user) return;

    const updatedUser: Partial<IUser> = {
      ...user,
      nome,
      CPF,
      matricula,
      categoria,
      unidade,
      status,
    };

    onSave(updatedUser);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Item de Estoque">
      <Stack gap={2}>
        <Input
          value={nome}
          onChange={setNome}
          label="Nome Completo"
          placeholder="João Silva"
          optional={false}
        />

        <Stack direction="row" spacing={2}>
          <Input
            value={CPF}
            onChange={setCPF}
            label="CPF"
            placeholder="123.456.789-00"
            optional={false}
            sx={{ flex: 1 }}
          />
          <Input
            value={matricula}
            onChange={setMatricula}
            label="Matrícula"
            placeholder="12345"
            optional={false}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Select
            value={categoria}
            label="Categoria"
            optional={false}
            onChange={setCategoria}
            options={mockCategorias}
          />
          <Select
            value={unidade}
            label="Unidade"
            optional={false}
            onChange={setUnidade}
            options={mockUnidades}
          />
        </Stack>

        <Select
          value={status}
          label="Status"
          optional={true}
          onChange={setStatus}
          options={mockStatuses}
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
            onClick={handleSave}
          >
            Salvar Alterações
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
