"use client";

import { Stack, Typography, Box, Button, } from "@mui/material";
import { ExportUsersModal, NewUserModal, UsersPageProps } from "./";
import React from "react";
import { CardGeneric, IconBox, TableGeneric, SelectGeneric, InputGeneric } from "../Generics";
import { DownloadIcon, FilterIcon, PlusIcon, SearchIcon, UsuariosCheckIcon, UsuariosXIcon } from "../Icons";
import { UsuariosIcon } from "../Sidebar/icons";

const cards = [
  {
    title: "Total Usuários",
    value: 0,
    icon: <UsuariosIcon color="#155DFC" />,
    bgColor: "#EFF6FF",
  },
  {
    title: "Usuários Ativos",
    value: 0,
    icon: <UsuariosCheckIcon color="#00A63E" />,
    bgColor: "#F0FDF4",
  },
  {
    title: "Total Inativos",
    value: 0,
    icon: <UsuariosXIcon color="#E7000B" />,
    bgColor: "#FEF2F2",
  },
  {
    title: "Administradores",
    value: 0,
    icon: <UsuariosIcon color="#9810FA" />,
    bgColor: "#FAF5FF",
  },
];

interface usersData {
  name: string;
  matricula: string;
  unidade: string;
  status: string;
  tipoAcesso: string;
  ultimaRefeicao: string;
  acoes: string;
}

export const mock: usersData[] = [
  {
    name: "João Silva",
    matricula: "12345",
    unidade: "10",
    status: "Ativo",
    tipoAcesso: "Administrador",
    ultimaRefeicao: "05/01/2026 12:30",
    acoes: "Editar / Excluir",
  },
  {
    name: "Maria Souza",
    matricula: "67890",
    unidade: "8",
    status: "Inativo",
    tipoAcesso: "Usuário",
    ultimaRefeicao: "04/01/2026 11:45",
    acoes: "Editar / Excluir",
  },
  {
    name: "Carlos Pereira",
    matricula: "54321",
    unidade: "12",
    status: "Ativo",
    tipoAcesso: "Usuário",
    ultimaRefeicao: "06/01/2026 08:15",
    acoes: "Editar / Excluir",
  },
  {
    name: "Ana Oliveira",
    matricula: "98765",
    unidade: "15",
    status: "Bloqueado",
    tipoAcesso: "Administrador",
    ultimaRefeicao: "05/01/2026 13:00",
    acoes: "Editar / Excluir",
  },
  {
    name: "Maria Souza",
    matricula: "67890",
    unidade: "8",
    status: "Inativo",
    tipoAcesso: "Usuário",
    ultimaRefeicao: "04/01/2026 11:45",
    acoes: "Editar / Excluir",
  },
  {
    name: "Carlos Pereira",
    matricula: "54321",
    unidade: "12",
    status: "Ativo",
    tipoAcesso: "Usuário",
    ultimaRefeicao: "06/01/2026 08:15",
    acoes: "Editar / Excluir",
  },
  {
    name: "Ana Oliveira",
    matricula: "98765",
    unidade: "15",
    status: "Bloqueado",
    tipoAcesso: "Administrador",
    ultimaRefeicao: "05/01/2026 13:00",
    acoes: "Editar / Excluir",
  },
];
const statuses = [
  { label: "Todos os status", value: "all" },
  { label: "Ativo", value: "active" },
  { label: "Inativo", value: "inactive" },
  { label: "Bloqueado", value: "blocked" },
];

const columns: any = [
  { key: "name", label: "Nome" },
  { key: "matricula", label: "Matrícula" },
  { key: "unidade", label: "Unidade", align: "right" },
  { key: "status", label: "Status" },
  { key: "tipoAcesso", label: "Tipo de Acesso" },
  { key: "ultimaRefeicao", label: "Última Refeição" },
];

const unidades = [
  { label: "Todas as unidades", value: 0 },
  { label: "Unidade 1", value: 1 },
  { label: "Unidade 2", value: 2 },
  { label: "Unidade 3", value: 3 },
];

const categorias = [
  { label: "Selecione uma categoria", value: "admin" },
  { label: "Administrador", value: "admin" },
  { label: "Usuário", value: "user" },
  { label: "Visitante", value: "visitor" },
];

export function UsersPage({ }: UsersPageProps) {
  const [openCreateUserModal, setOpenCreateUserModal] = React.useState(false);
  const [openExportUsersModal, setOpenExportUsersModal] = React.useState(false);

  const [userSearch, setUserSearch] = React.useState("");
  const [unidade, setUnidade] = React.useState(0);
  const [status, setStatus] = React.useState("all");

  // newUser states
  const [newUserName, setNewUserName] = React.useState("");
  const [newUserCpf, setNewUserCpf] = React.useState("");
  const [newUserMatricula, setNewUserMatricula] = React.useState("");
  const [newUserNumeroCartao, setNewUserNumeroCartao] = React.useState("");
  const [newUserCategoria, setNewUserCategoria] = React.useState(categorias[0].value);
  const [newUserUnidade, setNewUserUnidade] = React.useState(unidades[0].value);
  const [newUserStatus, setNewUserStatus] = React.useState(statuses[0].value);



  return (
    <Stack gap={2}>

      <Stack gap={2} direction={"row"} justifyContent={"space-between"}>
        <Box component="span">
          <Typography variant="h1" fontWeight={"600"} color="text.primary">
            Usuários
          </Typography>
          <Typography variant="body1" color="text.secondary"  >
            Gerencie os usuários do sistema
          </Typography>
        </Box>

        <Stack gap={2} direction={"row"}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => setOpenExportUsersModal(true)}
          >
            Exportar
          </Button>

          <ExportUsersModal
            open={openExportUsersModal}
            onClose={() => setOpenExportUsersModal(false)}
          />

          <Button
            variant="contained"
            startIcon={<PlusIcon />}
            onClick={() => setOpenCreateUserModal(true)}
          >
            Adicionar Usuário
          </Button>
          <NewUserModal
            open={openCreateUserModal}
            onClose={() => setOpenCreateUserModal(false)}
          />

        </Stack>
      </Stack>

      <CardGeneric>
        <Stack gap={2} direction={"row"}>

          <InputGeneric
            value={userSearch}
            onChange={setUserSearch}
            placeholder="Buscar por nome, matrícula..."
            icon={<SearchIcon />}

          />
          <SelectGeneric
            value={unidade}
            onChange={setUnidade}
            options={unidades}
            formControlSx={{ width: "26rem" }}
          />
          <SelectGeneric
            value={status}
            onChange={setStatus}
            options={statuses}
            formControlSx={{ width: "26rem" }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            sx={{ fontWeight: "400", minWidth: "120px" }}
            onClick={() => { }}
          >
            Filtrar
          </Button>

        </Stack>
        <Box
          display="grid"
          gap={2}
          gridTemplateColumns="repeat(auto-fit, minmax(236px, 1fr))"
        >
          {cards.map((card, i) => (
            <CardGeneric key={i} flexDirection="row" alignItems="center" gap={2}>
              <IconBox
                icon={card.icon}
                bgColor={card.bgColor}
                padding={2}
                borderRadius={3}
              />
              <Box>
                <Typography color="text.secondary" variant="h5" fontWeight={400}>
                  {card.title}
                </Typography>
                <Typography variant="h2" fontWeight={400} color="text.primary">
                  {card.value}
                </Typography>
              </Box>

            </CardGeneric>
          ))}
        </Box>

        <TableGeneric columns={columns} rows={mock} initialRowsPerPage={5} />

      </CardGeneric>
    </Stack>

  );
}
