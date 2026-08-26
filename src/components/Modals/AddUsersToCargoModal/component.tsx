"use client";

import { AlertColor, Button, Checkbox, Chip, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import Modal from "../Modal";
import { AddUsersToCargoModalProps } from "./interface";
import React from "react";
import { useForm } from "react-hook-form";
import Input from "@/components/FormControl/Input";
import Select from "@/components/FormControl/Select";
import Table from "@/components/Tables/Table";
import { cargoUsuariosColumns, cargoUsuariosSelecaoColumns } from "@/data/tableColumns";
import { mockStatuses } from "@/data/menuItems";
import { SearchIcon, TrashIcon } from "@/components/Icons";
import { ActionModal } from "../ActionModal/component";
import { useDebounce } from "@/hooks/useDebounce/hook";
import { getApiMessage } from "@/utils/apiMessage";
import { IUsuarioListItem } from "@/Interfaces/User/user";
import {
  ICargoUsuario,
  ICargoUsuariosResponse,
} from "@/Interfaces/ProfilePermissions/profilePermissions";

interface UsuariosPagePayload {
  results?: unknown;
  metadados?: { total_pages?: number };
}

const PAGE_SIZE = 100;

export default function AddUsersToCargoModal({
  open,
  onClose,
  profile,
  onAdded,
  onNotify,
}: AddUsersToCargoModalProps) {
  const [linkedUsers, setLinkedUsers] = React.useState<ICargoUsuario[]>([]);
  const [isLoadingLinked, setIsLoadingLinked] = React.useState(false);

  const [users, setUsers] = React.useState<IUsuarioListItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);
  const [hasMoreUsers, setHasMoreUsers] = React.useState(false);

  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [userToUnlink, setUserToUnlink] = React.useState<ICargoUsuario | null>(null);
  const [isUnlinking, setIsUnlinking] = React.useState(false);

  const { register, control, watch, reset } = useForm<{ search: string; status: string }>({
    defaultValues: {
      search: "",
      status: mockStatuses[0].value,
    },
  });

  const filters = watch();
  const debouncedSearch = useDebounce(filters.search, 500);

  const cargoId = profile?.id;

  // Mantém o notify em ref para que os fetches em efeito não dependam da
  // identidade da prop (um handler inline no pai causaria loop de requisição).
  const notifyRef = React.useRef(onNotify);
  React.useEffect(() => {
    notifyRef.current = onNotify;
  }, [onNotify]);

  const notify = React.useCallback(
    (message: string, severity?: AlertColor) => {
      notifyRef.current?.(message, severity);
    },
    [],
  );

  const loadLinkedUsers = React.useCallback(async () => {
    if (!cargoId) return;

    setIsLoadingLinked(true);

    try {
      const response = await fetch(
        `/api/cargos/${cargoId}/usuarios?page_size=${PAGE_SIZE}`,
      );
      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao carregar usuários do cargo" }));
        throw new Error(errData.message ?? "Erro ao carregar usuários do cargo");
      }

      const payload: ICargoUsuariosResponse = await response.json();
      setLinkedUsers(payload.results ?? []);
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Erro ao carregar usuários do cargo",
        "error",
      );
      setLinkedUsers([]);
    } finally {
      setIsLoadingLinked(false);
    }
  }, [cargoId, notify]);

  const loadUsers = React.useCallback(async () => {
    setIsLoadingUsers(true);

    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (filters.status && filters.status !== mockStatuses[0].value) {
        params.set("is_active", filters.status);
      }
      params.set("page_size", String(PAGE_SIZE));

      const response = await fetch(`/api/usuarios?${params.toString()}`);
      if (!response.ok) {
        const errData = await response
          .json()
          .catch(() => ({ message: "Erro ao carregar usuários" }));
        throw new Error(errData.message ?? "Erro ao carregar usuários");
      }

      const payload: UsuariosPagePayload = await response.json();
      setUsers(
        Array.isArray(payload.results) ? (payload.results as IUsuarioListItem[]) : [],
      );
      setHasMoreUsers((payload.metadados?.total_pages ?? 1) > 1);
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Erro ao carregar usuários",
        "error",
      );
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [debouncedSearch, filters.status, notify]);

  React.useEffect(() => {
    if (!open) return;

    setSelectedIds([]);
    setUserToUnlink(null);
    loadLinkedUsers();
  }, [open, loadLinkedUsers]);

  React.useEffect(() => {
    if (!open) return;
    loadUsers();
  }, [open, loadUsers]);

  const linkedIds = React.useMemo(
    () => new Set(linkedUsers.map((user) => user.id)),
    [linkedUsers],
  );

  const handleToggleUser = (userId: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId),
    );
  };

  const linkedColumns = React.useMemo(
    () =>
      cargoUsuariosColumns.map((col) =>
        col.key === "acoes"
          ? {
            ...col,
            render: (row: ICargoUsuario) => (
              <Tooltip title="Desvincular do cargo">
                <span>
                  <IconButton
                    aria-label="unlink"
                    size="small"
                    disabled={isUnlinking}
                    onClick={() => setUserToUnlink(row)}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      color: "text.secondary",
                    }}
                  >
                    <TrashIcon width={18} height={18} />
                  </IconButton>
                </span>
              </Tooltip>
            ),
          }
          : col,
      ),
    [isUnlinking],
  );

  const columns = React.useMemo(
    () =>
      cargoUsuariosSelecaoColumns.map((col) =>
        col.key === "selecionar"
          ? {
            ...col,
            render: (row: IUsuarioListItem) =>
              linkedIds.has(row.id) ? (
                <Chip label="Vinculado" size="small" color="default" />
              ) : (
                <Checkbox
                  size="small"
                  sx={{ padding: 0 }}
                  checked={selectedIds.includes(row.id)}
                  onChange={(event) => handleToggleUser(row.id, event.target.checked)}
                />
              ),
          }
          : col,
      ),
    [linkedIds, selectedIds],
  );

  const handleUnlinkUser = async () => {
    if (!cargoId || !userToUnlink) return;

    setIsUnlinking(true);

    try {
      const response = await fetch(
        `/api/cargos/${cargoId}/usuarios/${userToUnlink.id}`,
        { method: "DELETE" },
      );

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getApiMessage(payload, "Erro ao desvincular usuário"));
      }

      setUserToUnlink(null);
      notify(
        getApiMessage(payload, "Usuário desvinculado do cargo"),
        "success",
      );
      await loadLinkedUsers();
      onAdded?.();
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Erro ao desvincular usuário",
        "error",
      );
      setUserToUnlink(null);
    } finally {
      setIsUnlinking(false);
    }
  };

  const handleClose = () => {
    reset({ search: "", status: mockStatuses[0].value });
    setSelectedIds([]);
    onClose();
  };

  const handleAddUsers = async () => {
    if (!cargoId || selectedIds.length === 0) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/cargos/${cargoId}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_ids: selectedIds }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getApiMessage(payload, "Erro ao adicionar usuários ao cargo"));
      }

      const total = selectedIds.length;
      setSelectedIds([]);
      notify(
        getApiMessage(
          payload,
          total === 1
            ? "Usuário adicionado ao cargo"
            : `${total} usuários adicionados ao cargo`,
        ),
        "success",
      );
      await loadLinkedUsers();
      onAdded?.();
    } catch (err) {
      notify(
        err instanceof Error ? err.message : "Erro ao adicionar usuários ao cargo",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profile) return null;

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        maxWidth="md"
        title="Adicionar Perfil ao cargo"
        subtitle={`Vincule usuários da empresa ao cargo "${profile.nome}"`}
      >
        <Stack gap={3}>
          <Stack gap={1}>
            <Typography variant="body2" color="text.label">
              Usuários vinculados ({linkedUsers.length})
            </Typography>

            <Table
              columns={linkedColumns}
              rows={linkedUsers}
              initialRowsPerPage={5}
              isLoading={isLoadingLinked}
            />
          </Stack>

          <Stack gap={1}>
            <Typography variant="body2" color="text.label">
              Adicionar usuários
            </Typography>

            <Stack gap={2} direction={"row"}>
              <Input
                placeholder="Buscar por nome, matrícula..."
                icon={<SearchIcon />}
                register={register("search")}
              />

              <Select
                options={mockStatuses}
                name="status"
                control={control}
                formControlSx={{ maxWidth: "250px" }}
              />
            </Stack>

            <Table
              columns={columns}
              rows={users}
              initialRowsPerPage={5}
              isLoading={isLoadingUsers}
            />

            {hasMoreUsers && (
              <Typography variant="caption" color="text.secondary">
                Exibindo os primeiros {PAGE_SIZE} usuários. Refine a busca para
                encontrar os demais.
              </Typography>
            )}
          </Stack>

          <Stack direction="row" gap={2} justifyContent={"space-between"}>
            <Button
              variant="outlined"
              sx={{ flex: 1 }}
              onClick={handleClose}
              disabled={isSubmitting || isUnlinking}
            >
              Fechar
            </Button>
            <Button
              variant="contained"
              sx={{ flex: 1 }}
              onClick={handleAddUsers}
              disabled={isSubmitting || selectedIds.length === 0}
            >
              {isSubmitting
                ? "Adicionando..."
                : `Adicionar ao cargo${selectedIds.length > 0 ? ` (${selectedIds.length})` : ""}`}
            </Button>
          </Stack>
        </Stack>
      </Modal>

      {userToUnlink && (
        <ActionModal
          open={Boolean(userToUnlink)}
          onCancel={() => {
            if (!isUnlinking) setUserToUnlink(null);
          }}
          onConfirm={handleUnlinkUser}
          title="Tem certeza?"
          subtitle={`Essa ação irá desvincular "${userToUnlink.nome?.trim() || userToUnlink.documento}" do cargo "${profile.nome}", deseja continuar?`}
          confirmLabel={isUnlinking ? "Desvinculando..." : "Desvincular"}
          cancelLabel="Cancelar"
          color="error"
          icon={<TrashIcon width={60} height={60} />}
        />
      )}
    </React.Fragment>
  );
}
