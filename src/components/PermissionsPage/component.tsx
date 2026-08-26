"use client";

import { Alert, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { PermissionsPageProps } from "./index";
import React from "react";
import Card from "../Cards/Card";
import PageHeader from "../PageHeader";
import { useForm } from "react-hook-form";
import Input from "../FormControl/Input";
import { PlusIcon, SearchIcon } from "../Icons";
import ProfileCard from "./ProfileCard";
import NewPermissionProfileModal from "../Modals/NewPermissionProfileModal";
import AddUsersToCargoModal from "../Modals/AddUsersToCargoModal";
import {
  ICargosResponse,
  IProfilePermissions,
} from "@/Interfaces/ProfilePermissions/profilePermissions";
import { useDebounce } from "@/hooks/useDebounce/hook";
import { useToast } from "@/hooks/useToast/hook";
import Toast from "../Toast";

export function PermissionsPage({ }: PermissionsPageProps) {
  const { toast, showToast, closeToast } = useToast();
  const [openCreateProfileModal, setOpenCreateProfileModal] = React.useState(false);
  const [profileToAddUsers, setProfileToAddUsers] = React.useState<IProfilePermissions | null>(null);

  const [profiles, setProfiles] = React.useState<IProfilePermissions[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    watch
  } = useForm<{ profileSearch: string; }>({
    defaultValues: {
      profileSearch: ""
    },
  });

  const filters = watch();
  const debouncedSearch = useDebounce(filters.profileSearch, 500);

  const loadProfiles = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const allResults: IProfilePermissions[] = [];
      let page = 1;
      let totalPages = 1;

      do {
        const params = new URLSearchParams({
          page: String(page),
          page_size: "100",
        });

        const response = await fetch(`/api/cargos?${params.toString()}`);
        if (!response.ok) {
          const errData = await response
            .json()
            .catch(() => ({ message: "Erro ao carregar perfis" }));
          throw new Error(errData.message ?? "Erro ao carregar perfis");
        }

        const payload: ICargosResponse = await response.json();
        allResults.push(...(payload.results ?? []));

        totalPages = payload.metadados?.total_pages ?? 1;
        page += 1;
      } while (page <= totalPages);

      setProfiles(allResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar perfis");
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const filteredProfiles = React.useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return profiles;

    return profiles.filter((profile) =>
      `${profile.nome} ${profile.descricao}`.toLowerCase().includes(term),
    );
  }, [profiles, debouncedSearch]);

  return (
    <Stack gap={2} height={"100%"} maxHeight={"100%"}>
      <PageHeader
        title="Gerenciar Perfis e Permissões"
        subtitle="Configure permissões granulares para cada perfil de usuário"
      >
        <Button
          variant="contained"
          startIcon={<PlusIcon />}
          onClick={() => setOpenCreateProfileModal(true)}
        >
          Novo Perfil
        </Button>
      </PageHeader>

      <Card>
        <Input
          placeholder="Buscar perfis..."
          icon={<SearchIcon />}
          register={register("profileSearch")}
        />

        {error && <Alert severity="error">{error}</Alert>}

        {loading ? (
          <Stack alignItems="center" paddingY={4}>
            <CircularProgress />
          </Stack>
        ) : filteredProfiles.length === 0 ? (
          <Typography variant="body2" color="text.secondary" paddingY={4} textAlign="center">
            Nenhum perfil encontrado.
          </Typography>
        ) : (
          filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.uuid ?? profile.id}
              profile={profile}
              onUpdated={loadProfiles}
              onAddProfile={setProfileToAddUsers}
              onNotify={showToast}
            />
          ))
        )}
      </Card>

      <AddUsersToCargoModal
        open={Boolean(profileToAddUsers)}
        profile={profileToAddUsers}
        onClose={() => setProfileToAddUsers(null)}
        onAdded={loadProfiles}
        onNotify={showToast}
      />

      <NewPermissionProfileModal
        isOpen={openCreateProfileModal}
        onClose={() => setOpenCreateProfileModal(false)}
        onCreated={loadProfiles}
        onNotify={showToast}
      />

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        autoHideDuration={toast.duration}
        onClose={closeToast}
      />
    </Stack >
  );
}
