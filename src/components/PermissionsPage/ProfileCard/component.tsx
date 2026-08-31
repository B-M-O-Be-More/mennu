"use client";

import {
  Stack,
  Typography,
  Box,
  useTheme,
  Tooltip,
  IconButton,
  Collapse,
  Divider,
  Checkbox,
  Button,
  Chip,
} from "@mui/material";
import { ProfileCardProps } from "./";
import IconBox from "@/components/Cards/IconBox";
import { ArrowHeadIcon, EditIcon, PerfisPermissoesIcon, TrashIcon, UserPlusIcon } from "@/components/Icons";
import React from "react";
import Card from "@/components/Cards/Card";
import Table from "@/components/Tables/Table";
import { permissionsColumns } from "@/data/tableColumns";
import { ActionModal } from "@/components/Modals/ActionModal/component";
import { formatDate } from "@/utils/formatDate";
import { IProfilePermissionsItems } from "@/Interfaces/ProfilePermissions/profilePermissions";
import Input from "@/components/FormControl/Input";
import { getApiMessage } from "@/utils/apiMessage";

const permissionKeys = ["visualizar", "criar", "editar", "excluir"] as const;
type PermissionKey = (typeof permissionKeys)[number];

export default function ProfileCard({ profile, onUpdated, onAddProfile, onNotify }: ProfileCardProps) {
  const theme = useTheme();

  const [isOpen, setIsOpen] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [openDeleteProfileModal, setOpenDeleteProfileModal] = React.useState(false);
  const [permissions, setPermissions] = React.useState<IProfilePermissionsItems[]>(
    profile.permissoes_modulos ?? [],
  );
  const [nome, setNome] = React.useState(profile.nome);
  const [descricao, setDescricao] = React.useState(profile.descricao);

  React.useEffect(() => {
    setPermissions(profile.permissoes_modulos ?? []);
  }, [profile.permissoes_modulos]);

  React.useEffect(() => {
    setNome(profile.nome);
    setDescricao(profile.descricao);
  }, [profile.nome, profile.descricao]);

  const handleTogglePermission = React.useCallback(
    (rowIndex: number, key: PermissionKey, checked: boolean) => {
      setPermissions((prev) =>
        prev.map((permission, index) =>
          index === rowIndex ? { ...permission, [key]: checked } : permission,
        ),
      );
    },
    [],
  );

  const columns = React.useMemo(
    () =>
      permissionsColumns.map((col) =>
        isEditing && permissionKeys.includes(col.key as PermissionKey)
          ? {
            ...col,
            render: (row: IProfilePermissionsItems, rowIndex: number) => (
              <Checkbox
                size="small"
                sx={{ padding: 0 }}
                checked={Boolean(row[col.key as PermissionKey])}
                onChange={(event) =>
                  handleTogglePermission(
                    rowIndex,
                    col.key as PermissionKey,
                    event.target.checked,
                  )
                }
              />
            ),
          }
          : col,
      ),
    [isEditing, handleTogglePermission],
  );

  const resetForm = React.useCallback(() => {
    setPermissions(profile.permissoes_modulos ?? []);
    setNome(profile.nome);
    setDescricao(profile.descricao);
  }, [profile]);

  const handleStartEditing = () => {
    resetForm();
    setIsOpen(true);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    resetForm();
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    if (!nome.trim()) {
      onNotify?.("O nome é obrigatório", "warning");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/cargos/${profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          descricao: descricao.trim(),
          permissoes_modulos: permissions.map(
            ({ modulo, visualizar, criar, editar, excluir }) => ({
              modulo,
              visualizar,
              criar,
              editar,
              excluir,
            }),
          ),
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getApiMessage(payload, "Erro ao salvar perfil"));
      }

      setIsEditing(false);
      onNotify?.(getApiMessage(payload, "Perfil atualizado com sucesso"), "success");
      onUpdated?.();
    } catch (err) {
      onNotify?.(
        err instanceof Error ? err.message : "Erro ao salvar perfil",
        "error",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/cargos/${profile.id}`, {
        method: "DELETE",
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getApiMessage(payload, "Erro ao excluir perfil"));
      }

      setOpenDeleteProfileModal(false);
      onNotify?.(getApiMessage(payload, "Perfil excluído com sucesso"), "success");
      onUpdated?.();
    } catch (err) {
      onNotify?.(
        err instanceof Error ? err.message : "Erro ao excluir perfil",
        "error",
      );
      setOpenDeleteProfileModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <React.Fragment>
      <Card
        sx={{ padding: { sm: 1, md: 1.5 }, maxWidth: "auto" }}
        variant="compact"
      >
        <Stack direction={"row"} gap={2} >
          <IconBox
            icon={<PerfisPermissoesIcon color={theme.palette.purple.contrastText} />}
            bgColor="purple.main"
          />
          <Box flex={1}>
            {isEditing ? (
              <Stack gap={1} marginBottom={1}>
                <Input
                  placeholder="Nome do perfil"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  disabled={isSaving}
                />
                <Input
                  placeholder="Descreva as responsabilidades deste perfil"
                  multiline
                  minRows={2}
                  value={descricao}
                  onChange={(event) => setDescricao(event.target.value)}
                  disabled={isSaving}
                />
              </Stack>
            ) : (
              <React.Fragment>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography variant="h5" fontWeight={600}>
                    {profile.nome}
                  </Typography>
                  {profile.is_default && (
                    <Tooltip title="Cargo padrão do sistema">
                      <Chip label="Padrão" size="small" color="info" />
                    </Tooltip>
                  )}
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  {profile.descricao}
                </Typography>
              </React.Fragment>
            )}
            <Typography variant="body2" color="text.label">
              {profile.total_usuarios} {profile.total_usuarios === 1 ? "usuário" : "usuários"}
              {profile.criado_em
                ? ` •  Criado em ${formatDate(new Date(profile.criado_em), "dd/MM/yyyy")}`
                : ""}
            </Typography>
          </Box>
          <Stack direction={"row"} gap={1} marginLeft={"auto"}>
            <Tooltip title="Adicionar Perfil ao cargo">
              <span>
                <IconButton
                  aria-label="add-profile"
                  size="small"
                  disabled={isEditing || isDeleting}
                  onClick={() => onAddProfile?.(profile)}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    height: "fit-content",
                    color: "text.secondary",
                  }}
                >
                  <UserPlusIcon width={20} height={20} />
                </IconButton>
              </span>
            </Tooltip>
            {profile.editavel && (
              <Tooltip title={isEditing ? "Cancelar edição" : "Editar cargo"}>
                <span>
                  <IconButton
                    aria-label="edit"
                    size="small"
                    disabled={isSaving}
                    onClick={isEditing ? handleCancelEditing : handleStartEditing}
                    sx={{
                      border: "1px solid",
                      borderColor: isEditing ? "primary.main" : "divider",
                      borderRadius: 2,
                      height: "fit-content",
                      color: isEditing ? "primary.main" : "text.secondary",
                    }}
                  >
                    <EditIcon width={20} />
                  </IconButton>
                </span>
              </Tooltip>
            )}
            {profile.excluivel && (
              <Tooltip title="Excluir perfil">
                <span>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    disabled={isEditing || isDeleting}
                    onClick={() => setOpenDeleteProfileModal(true)}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      height: "fit-content",
                      color: "text.secondary",
                    }}
                  >
                    <TrashIcon width={20} color={theme.palette.error.contrastText} />
                  </IconButton>
                </span>
              </Tooltip>
            )}
            <Tooltip title={isOpen ? "Recolher" : "Expandir"}>
              <span>
                <IconButton
                  aria-label={isOpen ? "collapse" : "expand"}
                  size="small"
                  disabled={isEditing}
                  onClick={() => setIsOpen((prev) => !prev)}
                  sx={{
                    transition: "0.3s all",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    height: "fit-content",
                    color: "text.secondary",
                  }}
                >
                  <ArrowHeadIcon
                    width={20}
                    style={{
                      transition: "0.3s transform",
                      transform: isOpen ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Stack>
        <Collapse
          in={isOpen}
          timeout={600}
          easing="ease-in-out"
        >
          <Divider sx={{ borderColor: "grey.100", width: "100%", my: 2 }} />
          <Box paddingX={1}>
            <Typography variant="body2" mb={2} color="text.label">
              Matriz de Permissões
            </Typography>

            <Table
              columns={columns}
              rows={permissions}
              initialRowsPerPage={25}
            />

            {isEditing && (
              <Stack direction="row" gap={2} justifyContent="flex-end" marginTop={2}>
                <Button
                  variant="outlined"
                  onClick={handleCancelEditing}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </Stack>
            )}
          </Box>
        </Collapse>
      </Card>

      {
        openDeleteProfileModal && (
          <ActionModal
            open={openDeleteProfileModal}
            onCancel={() => {
              if (!isDeleting) setOpenDeleteProfileModal(false);
            }}
            onConfirm={handleDeleteProfile}
            title="Tem certeza?"
            subtitle={`Essa ação irá deletar o perfil "${profile.nome}", deseja continuar?`}
            confirmLabel={isDeleting ? "Deletando..." : "Deletar"}
            cancelLabel="Cancelar"
            color="error"
            icon={<TrashIcon width={60} height={60} />}
          />
        )
      }
    </React.Fragment>
  );
}
