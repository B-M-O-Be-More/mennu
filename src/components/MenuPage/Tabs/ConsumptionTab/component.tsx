"use client";

import Card from "@/components/Cards/Card";
import Input from "@/components/FormControl/Input";
import { FilterIcon, SearchIcon } from "@/components/Icons";
import Table from "@/components/Tables/Table";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import React from "react";
import { ConsumptionTabProps } from "./";
import { IMenu } from "@/Interfaces/Menu/menu";
import { consumptionHistoryColumns } from "@/data/tableColumns";
import { mockTiposCardapio, mockUnidades } from "@/data/menuItems";
import Select from "@/components/FormControl/Select";
import { mockConsumptionHistory } from "@/data/menus";
export function ConsumptionTab({ }: ConsumptionTabProps) {
  const theme = useTheme();

  const [openDeleteMenuModal, setOpenDeleteMenuModal] = React.useState(false);
  const [openViewMenuModal, setOpenViewMenuModal] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState<IMenu>({} as IMenu);

  const {
    register,
    watch
  } = useForm<{ menuSearch: string; unidade: string; tipos: string }>({
    defaultValues: {
      menuSearch: "",
      unidade: mockUnidades[0].value,
      tipos: mockTiposCardapio[0].value,
    },
  });

  const filters = watch()

  React.useEffect(() => {
    console.log(filters);
  }, [filters]);

  return (
    <>
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
            options={mockUnidades}
            register={register("unidade")}
            formControlSx={{ maxWidth: "250px" }}
          />

          <Select
            options={mockTiposCardapio}
            register={register("tipos")}
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


        <Card>
          <Box>
            <Typography>Histórico de Consumo</Typography>
            <Typography variant="body2" color="text.secondary">
              Total de {mockConsumptionHistory.filter(m => m.status === "liberado").length} refeições liberadas
            </Typography>
          </Box>

          <Table
            columns={consumptionHistoryColumns}
            rows={mockConsumptionHistory}
            initialRowsPerPage={5}
          />

        </Card>

      </Stack >
    </>
  );
}
