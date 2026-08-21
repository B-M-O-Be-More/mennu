"use client";

import { Stack, Typography, Box, Button, Avatar, } from "@mui/material";
import { UsersPageProps } from "./";
import React from "react";
import { CSVIcon, DownloadIcon, FileIcon, FilterIcon, PlusIcon, SearchIcon } from "../Icons";
import { cardsUsers } from "../../data/infos";
import NewUserModal from "../Modals/NewUserModal";
import Card from "../Cards/Card";
import Input from "../FormControl/Input";
import IconBox from "../Cards/IconBox";
import Select from "../FormControl/Select";
import { mockStatuses } from "@/data/menuItems";
import { userColumns } from "@/data/tableColumns";
import Table from "../Tables/Table";
import EditUserModal from "../Modals/EditUserModal";
import { useForm } from "react-hook-form";
import ActionCell from "../ActionCell";
import { IUser } from "@/Interfaces/User/user";
import PageHeader from "../PageHeader";
import ExportModal from "../Modals/ExportModal";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";

export const mockUsers: IUser[] = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao.silva@example.com",
    matricula: "12345",
    unidade: "10",
    tipo_usuario: "admin",
    status: true,
    ultima_refeicao: "05/01/2026 12:30",
    status_acesso: true,
    cpf: "123.456.789-00",
    numero_cartao: "1234567890",
    updated_at: "2026-01-05T12:35:00Z",
    token_access: {
      token: "abc123",
      expirado_em: "2026-01-06T12:35:00Z",
    },
  },
  {
    id: 2,
    nome: "Maria Souza",
    email: "maria.souza@example.com",
    matricula: "67890",
    unidade: "8",
    tipo_usuario: "funcionario",
    status: false,
    ultima_refeicao: "04/01/2026 11:45",
    status_acesso: false,
    cpf: "987.654.321-00",
    numero_cartao: "0987654321",
    updated_at: "2026-01-04T11:50:00Z",
    token_access: {
      token: "xyz789",
      expirado_em: "2026-01-05T11:50:00Z",
    },
  },
];

export function UsersPage({ }: UsersPageProps) {
  const { unitOptions } = useUnitFilterOptions();
  const [openCreateUserModal, setOpenCreateUserModal] = React.useState(false);
  const [openExportUsersModal, setOpenExportUsersModal] = React.useState(false);
  const [openEditUserModal, setOpenEditUserModal] = React.useState(false);

  const [selectedUser, setSelectedUser] = React.useState<IUser>({} as IUser);

  const {
    register,
    control,
    watch
  } = useForm<{ userSearch: string; unidade: string; status: string; }>({
    defaultValues: {
      userSearch: "",
      unidade: "all",
      status: mockStatuses[0].value,
    },
  });

  const filters = watch()

  React.useEffect(() => {
    console.log(filters);
  }, [filters]);

  return (
    <Stack gap={2}>
      <PageHeader
        title="Usuários"
        subtitle="Gerencie os usuários do sistema"
      >
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() => setOpenExportUsersModal(true)}
        >
          Exportar
        </Button>

        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={() => setOpenCreateUserModal(true)}
        >
          Adicionar Usuário
        </Button>
      </PageHeader>

      <ExportModal
        open={openExportUsersModal}
        onClose={() => setOpenExportUsersModal(false)}
        title="Exportar Usuários"
        subtitle="Escolha o formato da exportação"
        options={[
          {
            label: "PDF",
            description: "Relatório completo com gráficos e métricas",
            icon: <FileIcon color="#E5E7EB" />,
            bgColor: "#FF3D00",
            onPreview: () => { console.log("Preview CSV"); },
            onDownload: () => { console.log("Download CSV"); },

          },
          {
            label: "CSV",
            description: "Dados em formato de tabela separada por vírgulas",
            icon: <CSVIcon color="#198754" />,
            bgColor: "#B8EBAD",
            onPreview: () => { console.log("Preview CSV"); },
            onDownload: () => { console.log("Download CSV"); },
          },
        ]}
      />

      <NewUserModal
        open={openCreateUserModal}
        onClose={() => setOpenCreateUserModal(false)}
      />

      <Card>
        <Stack gap={2} direction={"row"}>
          <Input
            placeholder="Buscar por nome, matrícula..."
            icon={<SearchIcon />}
            register={register("userSearch")}
          />

          <Select
            options={unitOptions}
            name="unidade"
            control={control}
            formControlSx={{ maxWidth: "250px" }}
          />

          <Select
            options={mockStatuses}
            name="status"
            control={control}
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
                  <ActionCell
                    checked={true}
                    tooltipToggle="Ativar/Desativar usuário"
                    onToggle={(newState) => { console.log("Switch:", newState); }}
                    tooltipEdit="Editar usuário"
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
