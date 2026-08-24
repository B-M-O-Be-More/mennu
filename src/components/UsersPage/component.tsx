"use client";

import { Stack, Typography, Box, Button, Alert } from "@mui/material";
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
import { useForm } from "react-hook-form";
import ActionCell from "../ActionCell";
import { IUsuarioListItem } from "@/Interfaces/User/user";
import PageHeader from "../PageHeader";
import ExportModal from "../Modals/ExportModal";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";
import { useDebounce } from "@/hooks/useDebounce/hook";

interface PaginationMetadados {
  total_pages?: number;
}

interface UsuariosPagePayload {
  results?: unknown;
  metadados?: PaginationMetadados;
}

interface CargoListPayload {
  results?: { total_usuarios?: number }[];
}

export function UsersPage({ }: UsersPageProps) {
  const { unitOptions } = useUnitFilterOptions();
  const [openCreateUserModal, setOpenCreateUserModal] = React.useState(false);
  const [openExportUsersModal, setOpenExportUsersModal] = React.useState(false);

  const [users, setUsers] = React.useState<IUsuarioListItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [adminCount, setAdminCount] = React.useState(0);

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

  const filters = watch();
  const debouncedSearch = useDebounce(filters.userSearch, 500);

  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const baseParams = new URLSearchParams();
      if (debouncedSearch) baseParams.set("search", debouncedSearch);
      if (filters.unidade && filters.unidade !== "all") {
        baseParams.set("unidade_id", filters.unidade);
      }
      if (filters.status && filters.status !== mockStatuses[0].value) {
        baseParams.set("is_active", filters.status);
      }
      baseParams.set("page_size", "200");

      const allResults: IUsuarioListItem[] = [];
      let page = 1;
      let totalPages = 1;

      do {
        const params = new URLSearchParams(baseParams);
        params.set("page", String(page));

        const response = await fetch(`/api/usuarios?${params.toString()}`);
        if (!response.ok) {
          const errData = await response
            .json()
            .catch(() => ({ message: "Erro ao carregar usuários" }));
          throw new Error(errData.message ?? "Erro ao carregar usuários");
        }

        const payload: UsuariosPagePayload = await response.json();
        const results = Array.isArray(payload.results)
          ? (payload.results as IUsuarioListItem[])
          : [];

        allResults.push(...results);
        totalPages = payload.metadados?.total_pages ?? 1;
        page += 1;
      } while (page <= totalPages);

      setUsers(allResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar usuários");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.unidade, filters.status]);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  React.useEffect(() => {
    const loadAdminCount = async () => {
      try {
        const response = await fetch("/api/cargos?nome=Administrador");
        if (!response.ok) return;

        const payload: CargoListPayload = await response.json();
        const total = (payload.results ?? []).reduce(
          (sum, cargo) => sum + (cargo.total_usuarios ?? 0),
          0,
        );
        setAdminCount(total);
      } catch {
        setAdminCount(0);
      }
    };

    loadAdminCount();
  }, []);

  const handleToggleUser = async (user: IUsuarioListItem, newState: boolean) => {
    try {
      const response = await fetch(`/api/usuarios/${user.id}/status`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Erro ao alterar status do usuário");
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, is_active: newState } : u)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao alterar status do usuário");
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.is_active).length;
  const inactiveUsers = totalUsers - activeUsers;

  const cardValues: Record<string, number> = {
    "Total Usuários": totalUsers,
    "Usuários Ativos": activeUsers,
    "Total Inativos": inactiveUsers,
    "Administradores": adminCount,
  };

  const statCards = cardsUsers.map((card) => ({
    ...card,
    value: cardValues[card.title] ?? card.value,
  }));

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
        onCreated={loadUsers}
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
            onClick={() => loadUsers()}
          >
            Filtrar
          </Button>

        </Stack>
        <Box
          display="grid"
          gap={2}
          gridTemplateColumns="repeat(auto-fit, minmax(240px, 1fr))"
        >
          {statCards.map((card, i) => (
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

        {error && <Alert severity="error">{error}</Alert>}

        <Table
          columns={userColumns.map(col =>
            col.key === "acoes"
              ? {
                ...col,
                render: (row: IUsuarioListItem) => (
                  <ActionCell
                    checked={row.is_active}
                    tooltipToggle="Ativar/Desativar usuário"
                    onToggle={(newState) => handleToggleUser(row, newState)}
                    tooltipEdit="Editar usuário"
                  />
                ),
              }
              : col
          )}
          rows={users}
          initialRowsPerPage={5}
          isLoading={loading}
        />
      </Card>
    </Stack>

  );
}
