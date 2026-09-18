import React from "react";
import { Button, Stack } from "@mui/material";
import PageHeader from "../PageHeader";
import {
  EyeIcon,
  PaperIcon,
  RelatoriosIcon,
  UpdateIcon,
} from "../Icons";
import TabButton from "../TabButton";
import ConsumptionHistoryTab from "./Tabs/ConsumptionHistoryTab";
import DashboardTab from "./Tabs/DashboardTab";

export function ReportsPage() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [refreshKey, setRefreshKey] = React.useState(0);

  return (
    <Stack gap={2}>
      <PageHeader
        title="Relatórios"
        subtitle="Histórico de consumo e análises do sistema">
        <Button
          variant="outlined"
          startIcon={<EyeIcon height={24} />}
          disabled
        >
          Registrar Visualização
        </Button>
        <Button
          variant="outlined"
          startIcon={<UpdateIcon height={24} />}
          onClick={() => setRefreshKey((prev) => prev + 1)}
        >
          Atualizar
        </Button>
      </PageHeader>

      <Stack direction={"row"} gap={2}>
        <TabButton
          label={"Histórico de Consumo"}
          icon={<PaperIcon height={24} />}
          tabIndex={0}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <TabButton
          label={"Dashboard"}
          icon={<RelatoriosIcon height={24} />}
          tabIndex={1}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </Stack>

      {activeTab === 0 && <ConsumptionHistoryTab key={`consumo-${refreshKey}`} />}
      {activeTab === 1 && <DashboardTab key={`dashboard-${refreshKey}`} />}
    </Stack>
  );
}
