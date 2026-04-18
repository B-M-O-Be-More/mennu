"use client";

import { Button, CircularProgress, Stack } from "@mui/material";
import { PermissionsPageProps } from "./index";
import React from "react";
import Card from "../Cards/Card";
import PageHeader from "../PageHeader";
import { useForm } from "react-hook-form";
import Input from "../FormControl/Input";
import { PlusIcon, SearchIcon } from "../Icons";
import ProfileCard from "./ProfileCard";
import NewPermissionProfileModal from "../Modals/NewPermissionProfileModal";
import useFetch from "@/hooks/useFetch/hook";
import { IProfilePermissions } from "@/Interfaces/ProfilePermissions/profilePermissions";

interface CargoListItem {
  id: number;
  nome: string;
  descricao: string;
  total_usuarios: number;
  criado_em: string;
}

interface PaginatedCargos {
  results: CargoListItem[];
  message: string;
}

function mapCargoToProfile(cargo: CargoListItem): IProfilePermissions {
  return {
    id: cargo.id,
    nome: cargo.nome,
    descricao: cargo.descricao,
    usuarios: new Array(cargo.total_usuarios ?? 0).fill(""),
    criadoEm: cargo.criado_em,
    permissoes: [],
  };
}

export function PermissionsPage({ }: PermissionsPageProps) {
  const [openCreateProfileModal, setOpenCreateProfileModal] = React.useState(false);
  const [profiles, setProfiles] = React.useState<IProfilePermissions[]>([]);
  const [refreshKey, setRefreshKey] = React.useState(0);

  const [requestCargos, isLoading] = useFetch<PaginatedCargos>();

  const { register, watch } = useForm<{ profileSearch: string; }>({
    defaultValues: { profileSearch: "" },
  });

  const profileSearch = watch("profileSearch");

  React.useEffect(() => {
    requestCargos("/api/cargos/", { method: "GET" })
      .then((resp) => {
        const raw = resp as unknown as PaginatedCargos;
        const data = (raw.results ?? []).map(mapCargoToProfile);
        setProfiles(data);
      })
      .catch(() => setProfiles([]));
  }, [refreshKey]);

  const filteredProfiles = profiles.filter((p) =>
    p.nome.toLowerCase().includes(profileSearch.toLowerCase()),
  );

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
        {isLoading ? (
          <Stack alignItems="center" py={4}><CircularProgress /></Stack>
        ) : (
          filteredProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))
        )}
      </Card>

      <NewPermissionProfileModal
        isOpen={openCreateProfileModal}
        onClose={() => setOpenCreateProfileModal(false)}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
    </Stack>
  );
}
