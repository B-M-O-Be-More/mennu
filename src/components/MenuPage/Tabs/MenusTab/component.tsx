"use client";

import Card from "@/components/Cards/Card";
import Input from "@/components/FormControl/Input";
import { EyeIcon, FilterIcon, SearchIcon, TrashIcon } from "@/components/Icons";
import Table from "@/components/Tables/Table";
import { Button, IconButton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import React from "react";
import { MenusTabProps } from "./";
import { IMenu } from "@/Interfaces/Menu/menu";
import MenuItemCard from "./MenuItemCard";
import { menuColumns } from "@/data/tableColumns";
import { mockTiposCardapio } from "@/data/menuItems";
import Select from "@/components/FormControl/Select";
import { mockMenus } from "@/data/menus";
import ViewMenuModal from "@/components/Modals/ViewMenuModal";
import { ActionModal } from "@/components/Modals/ActionModal/component";
import { formatDate } from "@/utils/formatDate";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";

export function MenusTab({ }: MenusTabProps) {
  const theme = useTheme();
  const { unitOptions } = useUnitFilterOptions();

  const [openDeleteMenuModal, setOpenDeleteMenuModal] = React.useState(false);
  const [openViewMenuModal, setOpenViewMenuModal] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState<IMenu | null>(null);

  const {
    register,
    control,
    watch
  } = useForm<{ menuSearch: string; unidade: string; tipos: string }>({
    defaultValues: {
      menuSearch: "",
      unidade: "all",
      tipos: mockTiposCardapio[0].value,
    },
  });

  const filters = watch()

  React.useEffect(() => {
    console.log(filters);
  }, [filters]);

  return (
    <React.Fragment>
      <Stack
        gap={0}
        padding={{ xs: 1, md: 3 }}
        spacing={2}
        border="1px solid"
        borderColor="divider"
        borderRadius={2}
        bgcolor="background.paper"
      >
        <Stack gap={{ xs: 1, sm: 2 }} direction={"row"}>
          <Input
            placeholder="Buscar por nome, matrícula..."
            icon={<SearchIcon />}
            register={register("menuSearch")}
          />
          <Select
            options={unitOptions}
            name="unidade"
            control={control}
            formControlSx={{ maxWidth: "250px" }}
          />

          <Select
            options={mockTiposCardapio}
            name="tipos"
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

        <Stack
          gap={2}
          direction={{ xs: "column", sm: "row" }}
          sx={{ overflowX: "auto", paddingBottom: 1, marginBottom: -1 }}
        >
          {mockMenus.map((item, i) => (
            <MenuItemCard
              key={i}
              item={item}
            />
          ))}
        </Stack>

      </Stack >

      <Card>
        <Typography>Cardápios Recentes</Typography>

        <Table
          columns={menuColumns.map(col =>
            col.key === "acoes"
              ? {
                ...col,
                render: (row: IMenu) => (
                  <Stack direction={"row"} alignItems="center">
                    <Tooltip title="Visualizar cardápio" arrow>
                      <IconButton
                        aria-label="visualizar cardápio"
                        size="small"
                        onClick={() => {
                          setSelectedMenu(row);
                          setOpenViewMenuModal(true);
                        }}
                        sx={{
                          height: "fit-content",
                        }}
                      >
                        <EyeIcon width={20} color={theme.palette.primary.main} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Deletar cardápio" arrow>
                      <IconButton
                        aria-label="deletar cardápio"
                        size="small"
                        onClick={() => {
                          setSelectedMenu(row);
                          setOpenDeleteMenuModal(true);
                        }}
                        sx={{
                          height: "fit-content",
                        }}
                      >
                        <TrashIcon width={20} color={theme.palette.error.contrastText} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ),
              }
              : col
          )}
          rows={mockMenus}
          initialRowsPerPage={5}
        />
      </Card>

      {
        openViewMenuModal && selectedMenu &&
        <ViewMenuModal
          isOpen={openViewMenuModal}
          onClose={() => setOpenViewMenuModal(false)}
          data={selectedMenu}
        />
      }

      {
        openDeleteMenuModal && selectedMenu && (
          <ActionModal
            open={openDeleteMenuModal}
            onCancel={() => setOpenDeleteMenuModal(false)}
            onConfirm={() => console.log("Menu deleted:", selectedMenu)}
            title="Tem certeza?"
            subtitle={`Essa ação irá deletar o cardápio da data "${formatDate(new Date(selectedMenu.data), "dd/MM/yyyy")}", deseja continuar?`}
            confirmLabel="Confirmar"
            cancelLabel="Cancelar"
            color="error"
            icon={<TrashIcon width={60} height={60} />}
          />
        )
      }
    </React.Fragment>
  );
}
