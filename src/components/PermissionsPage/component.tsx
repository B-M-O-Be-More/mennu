"use client";

import { Button, Stack } from "@mui/material";
import { PermissionsPageProps } from "./index";
import React from "react";
import Card from "../Cards/Card";
import PageHeader from "../PageHeader";
import { useForm } from "react-hook-form";
import Input from "../FormControl/Input";
import { PlusIcon, SearchIcon } from "../Icons";
import { profilePermissionsMock } from "@/data/permissions";
import ProfileCard from "./ProfileCard";
import NewPermissionProfileModal from "../Modals/NewPermissionProfileModal";

export function PermissionsPage({ }: PermissionsPageProps) {
  const [openCreateProfileModal, setOpenCreateProfileModal] = React.useState(false);

  const {
    register,
    watch
  } = useForm<{ profileSearch: string; }>({
    defaultValues: {
      profileSearch: ""
    },
  });

  const filters = watch()

  React.useEffect(() => {
    console.log(filters);
  }, [filters])

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
        {
          profilePermissionsMock.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))
        }
      </Card>

      <NewPermissionProfileModal
        isOpen={openCreateProfileModal}
        onClose={() => setOpenCreateProfileModal(false)}
      />
    </Stack >
  );
}
