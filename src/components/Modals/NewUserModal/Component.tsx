import React from "react";
import { Stack, Typography, Box, Button } from "@mui/material";
import { UsuariosIcon } from "../../Sidebar/icons";
import { mockCategorias, mockUnidades, mockStatuses } from "../../../data/menuItems";
import { NewUserModalProps } from ".";
import Modal from "../Modal";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";

export default function NewUserModal({ open, onClose }: NewUserModalProps) {
  const [newUserName, setNewUserName] = React.useState("");
  const [newUserCpf, setNewUserCpf] = React.useState("");
  const [newUserMatricula, setNewUserMatricula] = React.useState("");
  const [newUserCategoria, setNewUserCategoria] = React.useState(mockCategorias[0].value);
  const [newUserUnidade, setNewUserUnidade] = React.useState(mockUnidades[0].value);
  const [newUserStatus, setNewUserStatus] = React.useState(mockStatuses[0].value);
  const [newUserNumeroCartao, setNewUserNumeroCartao] = React.useState("");

  const handleSave = () => {
    console.log({
      newUserName,
      newUserCpf,
      newUserMatricula,
      newUserCategoria,
      newUserUnidade,
      newUserStatus,
      newUserNumeroCartao,
    });

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Novo Usuário">
      <Stack gap={2}>
        <Stack direction="row" spacing={2}>
          <Input
            value={newUserName}
            onChange={setNewUserName}
            label="Nome Completo"
            placeholder="Ex. João Silva"
            optional={false}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Input
            value={newUserCpf}
            onChange={setNewUserCpf}
            label="CPF"
            placeholder="Ex. 000.000.000-00"
            optional={false}
            sx={{ flex: 1 }}
          />
          <Input
            value={newUserMatricula}
            onChange={setNewUserMatricula}
            label="Matrícula"
            placeholder="Ex. 123456"
            optional={false}
            sx={{ flex: 1 }}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Select
            value={newUserCategoria}
            label="Categoria"
            optional={false}
            onChange={setNewUserCategoria}
            options={mockCategorias}
          />
          <Select
            value={newUserUnidade}
            label="Unidade"
            optional={false}
            onChange={setNewUserUnidade}
            options={mockUnidades}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <Select
            value={newUserStatus}
            label="Status"
            optional={true}
            onChange={setNewUserStatus}
            options={mockStatuses}
          />
          <Input
            value={newUserNumeroCartao}
            onChange={setNewUserNumeroCartao}
            label="Número do Cartão"
            placeholder="Ex: 1250458-25"
            optional={true}
            sx={{ flex: 1 }}
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
            sx={{
              flex: 1,
            }}
            variant="contained"
            onClick={handleSave}
          >
            Criar Novo Usuário
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
