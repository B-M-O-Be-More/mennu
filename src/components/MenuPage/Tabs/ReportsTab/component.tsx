"use client";

import Card from "@/components/Cards/Card";
import Input from "@/components/FormControl/Input";
import { FilterIcon, SearchIcon, StatsIcon, TwistedArrowIcon } from "@/components/Icons";
import Table from "@/components/Tables/Table";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useForm } from "react-hook-form";
import React from "react";
import { ReportsTabProps } from ".";
import { reportsMenuColumns } from "@/data/tableColumns";
import { mockTiposCardapio } from "@/data/menuItems";
import Select from "@/components/FormControl/Select";
import TabButton from "@/components/TabButton";
import BarChart from "@/components/Charts/BarChart";
import { mockReportsMenu } from "@/data/menus";
import { useUnitFilterOptions } from "@/hooks/useUnitFilterOptions/hook";

const tabs = [
  { label: "Visão Geral", icon: <TwistedArrowIcon height={24} /> },
  { label: "Gráficos", icon: <StatsIcon height={24} /> },
];

export function ReportsTab({ }: ReportsTabProps) {
  const theme = useTheme();
  const { unitOptions } = useUnitFilterOptions();

  const [activeTab, setActiveTab] = React.useState(0);

  const {
    register,
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
    <>
      <Stack direction={"row"} gap={2}>
        {tabs.map((tab, index) => (
          <TabButton
            key={index}
            label={tab.label}
            icon={tab.icon}
            tabIndex={index}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        ))}
      </Stack>

      <Card>
        <Stack gap={{ xs: 1, sm: 2 }} direction={"row"}>
          <Input
            placeholder="Buscar por nome, matrícula..."
            icon={<SearchIcon />}
            register={register("menuSearch")}
          />

          <Select
            options={unitOptions}
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
      </Card >

      {activeTab === 0 &&
        <Card>
          <Box>
            <Stack direction={"row"} alignItems={"center"} gap={1}>
              <TwistedArrowIcon height={22} width={22} style={{ transform: "scaleY(-1)" }} color={theme.palette.primary.main} />
              <Typography>Planejado vs Realizado</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">Comparação de produção e consumo</Typography>
          </Box>

          <Table
            columns={reportsMenuColumns}
            rows={mockReportsMenu}
            initialRowsPerPage={5}
          />
        </Card>
      }

      {
        activeTab === 1 &&
        <Card>
          <Box>
            <Stack direction={"row"} alignItems={"center"} gap={1}>
              <StatsIcon height={22} width={22} style={{ transform: "scaleY(-1)" }} color={theme.palette.primary.main} />
              <Typography>Consumo por Refeição</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Quantidade de refeições servidas por data - Agrupar por tipo
            </Typography>
          </Box>

          <BarChart
            labels={["02/12/2025", "03/12/2025"]}
            datasets={[
              { label: "Almoço", data: [2, 2], backgroundColor: "#3B82F6" },
              { label: "Café da Manhã", data: [0, 1], backgroundColor: "#EF4444" },
              { label: "Jantar", data: [0, 0], backgroundColor: "#22C55E" },
              { label: "Lanche", data: [0, 0], backgroundColor: "#FACC15" },
            ]}
            title="Consumo por Refeição"
          />

        </Card>
      }
    </>
  );
}
