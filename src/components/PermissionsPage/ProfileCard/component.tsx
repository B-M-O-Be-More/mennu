"use client";

import { Stack, Typography, Box, useTheme, Tooltip, IconButton, Collapse, Divider } from "@mui/material";
import { ProfileCardProps } from "./";
import IconBox from "@/components/Cards/IconBox";
import { ArrowHeadIcon, EditIcon, PerfisPermissoesIcon, TrashIcon } from "@/components/Icons";
import React from "react";
import Card from "@/components/Cards/Card";
import Table from "@/components/Tables/Table";
import { permissionsColumns } from "@/data/tableColumns";
import { ActionModal } from "@/components/Modals/ActionModal/component";

export default function ProfileCard({ profile }: ProfileCardProps) {
  const theme = useTheme();

  const [isOpen, setIsOpen] = React.useState(false);
  const [openDeleteProfileModal, setOpenDeleteProfileModal] = React.useState(false);

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
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {profile.nome}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {profile.descricao}
            </Typography>
            <Typography variant="body2" color="text.label">
              {profile.usuarios.length} usuários •  Criado em {profile.criadoEm}
            </Typography>
          </Box>
          <Stack direction={"row"} gap={1} marginLeft={"auto"}>
            <Tooltip title="Editar perfil">
              <IconButton
                aria-label="edit"
                size="small"
                onClick={() => { }}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  height: "fit-content",
                  color: "text.secondary",
                }}
              >
                <EditIcon width={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir perfil">
              <IconButton
                aria-label="delete"
                size="small"
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
            </Tooltip>
            <Tooltip title={isOpen ? "Recolher" : "Expandir"}>
              <IconButton
                aria-label={isOpen ? "collapse" : "expand"}
                size="small"
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
              columns={permissionsColumns}
              rows={profile.permissoes}
            />
          </Box>
        </Collapse>
      </Card>

      {
        openDeleteProfileModal && (
          <ActionModal
            open={openDeleteProfileModal}
            onCancel={() => setOpenDeleteProfileModal(false)}
            onConfirm={() => console.log("Profile deleted:", profile.nome)}
            title="Tem certeza?"
            subtitle={`Essa ação irá deletar o perfil "${profile.nome}", deseja continuar?`}
            confirmLabel="Deletar"
            cancelLabel="Cancelar"
            color="error"
            icon={<TrashIcon width={60} height={60} />}
          />
        )
      }
    </React.Fragment>
  );
}
