"use client";

import { Stack, Typography, Box, Button, } from "@mui/material";
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
import { userColumns } from "@/data/tableColumns";
import Table from "../Tables/Table";

export const mockUsers = [
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


export function UsersPage({ }: UsersPageProps) {
  const [openCreateUserModal, setOpenCreateUserModal] = React.useState(false);
  const [openExportUsersModal, setOpenExportUsersModal] = React.useState(false);

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
            formControlSx={{ width: "26rem" }}
          />
          <Select
            value={status}
            onChange={setStatus}
            options={mockStatuses}
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

      </Card>
    </Stack>

  );
}
