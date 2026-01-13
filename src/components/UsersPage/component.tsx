"use client";

import { Stack, Typography, Box, Button, Avatar, } from "@mui/material";
import { ExportUsersModal, UsersPageProps } from "./";
import React from "react";
import { DownloadIcon, FilterIcon, PlusIcon, SearchIcon } from "../Icons";
import { cardsUsers } from "../../data/infos";
import NewUserModal from "../Modals/NewUserModal";
import Card from "../Cards/Card";
import Input from "../FormControl/Input";
import IconBox from "../Cards/IconBox";
import Select from "../FormControl/Select";
import { mockStatuses, mockUnidades } from "@/data/menuItems";
import { userColumns, usersData } from "@/data/tableColumns";
import Table from "../Tables/Table";
import EditUserModal from "../Modals/EditUserModal";

export const mockUsers: usersData[] = [
  {
    nome: "João Silva",
    matricula: "12345",
    unidade: "10",
    status: "Ativo",
    ultimaRefeicao: "05/01/2026 12:30",
    categoria: "Administrador",
    acoes: <></>,
  },
  {
    nome: "Maria Souza",
    matricula: "67890",
    unidade: "8",
    status: "Inativo",
    ultimaRefeicao: "04/01/2026 11:45",
    categoria: "Usuário",
    acoes: <></>,
  },
];


const userMock =
{
  nome: "João Silva",
  matricula: "12345",
  unidade: "10",
  status: "Ativo",
  CPF: "123.456.789-00",
  categoria: "Administrador",
  numeroCartao: "1234567890",
}

export function UsersPage({ }: UsersPageProps) {
  const [openCreateUserModal, setOpenCreateUserModal] = React.useState(false);
  const [openExportUsersModal, setOpenExportUsersModal] = React.useState(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);

  const [userSearch, setUserSearch] = React.useState("");
  const [unidade, setUnidade] = React.useState("");
  const [status, setStatus] = React.useState("");

  return (
    <Stack gap={2}>

      <Stack gap={2} direction={"row"} justifyContent={"space-between"}>
        <Box component="span">
          <Typography variant="h1" fontWeight={"600"} color="text.primary">
            Usuários
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={400}>
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

      <Card>
        <Stack gap={2} direction={"row"}>

          <Input
            value={userSearch}
            onChange={setUserSearch}
            placeholder="Buscar por nome, matrícula..."
            icon={<SearchIcon />}
          />
          <Select
            value={unidade}
            onChange={setUnidade}
            options={mockUnidades}
            formControlSx={{ maxWidth: "10rem" }}
          />
          <Select
            value={status}
            onChange={setStatus}
            options={mockStatuses}
            formControlSx={{ maxWidth: "10rem" }}
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
          {cardsUsers.map((card, i) => (
            <Card key={i} flexDirection="row" alignItems="center" gap={2}>
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

            </Card>
          ))}
        </Box>

        <Table columns={userColumns} rows={mockUsers} initialRowsPerPage={5} />
        <EditUserModal
          open={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          user={userMock}
          onSave={() => { }}
        />

      </Card>
    </Stack>

  );
}
