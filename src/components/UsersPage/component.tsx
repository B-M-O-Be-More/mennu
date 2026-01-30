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
import { IUser, userColumns } from "@/data/tableColumns";
import Table from "../Tables/Table";
import EditUserModal from "../Modals/EditUserModal";
import { useForm } from "react-hook-form";
import ActionCell from "../ActionCell";

export const mockUsers: IUser[] = [
  {
    nome: "João Silva",
    matricula: "12345",
    unidade: "10",
    status: "Ativo",
    ultimaRefeicao: "05/01/2026 12:30",
    categoria: "Administrador",
    CPF: "123.456.789-00",
    numeroCartao: "1234567890",
  },
  {
    nome: "Maria Souza",
    matricula: "67890",
    unidade: "8",
    status: "Inativo",
    ultimaRefeicao: "04/01/2026 11:45",
    categoria: "Usuário",
    CPF: "987.654.321-00",
    numeroCartao: "0987654321",
  },
];

export function UsersPage({ }: UsersPageProps) {
  const [openCreateUserModal, setOpenCreateUserModal] = React.useState(false);
  const [openExportUsersModal, setOpenExportUsersModal] = React.useState(false);
  const [openEditUserModal, setOpenEditUserModal] = React.useState(false);

  const [selectedUser, setSelectedUser] = React.useState<IUser>({} as IUser);

  const {
    register,
    watch
  } = useForm<{ userSearch: string; unidade: string; status: string; }>({
    defaultValues: {
      userSearch: "",
      unidade: mockUnidades[0].value,
      status: mockStatuses[0].value,
    },
  });

  const filters = watch()

  React.useEffect(() => {
    console.log(filters);
  }, [filters]);

  return (
    <Stack gap={2}>
      <Stack gap={2} direction={"row"} justifyContent={"space-between"}>
        <Box component="span">
          <Typography variant="h4" fontWeight={"600"} color="text.primary">
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
            placeholder="Buscar por nome, matrícula..."
            icon={<SearchIcon />}
            register={register("userSearch")}
          />

          <Select
            options={mockUnidades}
            register={register("unidade")}
            formControlSx={{ maxWidth: "250px" }}
          />

          <Select
            options={mockStatuses}
            register={register("status")}
            formControlSx={{ maxWidth: "250px" }}
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
          gridTemplateColumns="repeat(auto-fit, minmax(240px, 1fr))"
        >
          {cardsUsers.map((card, i) => (
            <Card key={i} flexDirection="row" alignItems="center" gap={2} paddingY={1.5}>
              <IconBox
                icon={card.icon}
                bgColor={card.bgColor}
                padding={2}
                borderRadius={3}
              />
              <Box>
                <Typography color="text.secondary" variant="body1" fontWeight={400}>
                  {card.title}
                </Typography>
                <Typography variant="h4" fontWeight={400} color="text.primary">
                  {card.value}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>

        <Table
          columns={userColumns.map(col =>
            col.key === "acoes"
              ? {
                ...col,
                render: (row: IUser) => (
                  <ActionCell checked={true} onToggle={(newState) => { console.log("Switch:", newState); }}
                    onEdit={() => {
                      setSelectedUser(row);
                      setOpenEditUserModal(true);
                    }}
                  />
                ),
              }
              : col
          )}
          rows={mockUsers}
          initialRowsPerPage={5}
        />
        <EditUserModal
          open={openEditUserModal}
          onClose={() => setOpenEditUserModal(false)}
          user={selectedUser}
          onSave={() => { }}
        />

      </Card>
    </Stack>

  );
}
