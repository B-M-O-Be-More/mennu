import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import PageHeader from "../PageHeader";
import {
  DownloadIcon,
  EyeIcon,
  PaperIcon,
  RelatoriosIcon,
  UpdateIcon,
} from "../Icons";
import TabButton from "../TabButton";
import ConsumptionHistoryTab from "./Tabs/ConsumptionHistoryTab";

const headerButtons = [
  {
    icon: <EyeIcon height={24} />,
    label: "Registrar Visualização",
    variant: "outlined" as const,
    onClick: () => console.log("registrar visualização"),
  },
  {
    icon: <UpdateIcon height={24} />,
    label: "Atualizar",
    variant: "outlined" as const,
    onClick: () => console.log("atualizar"),
  },
  {
    icon: <DownloadIcon height={24} />,
    label: "Exportar",
    variant: "contained" as const,
    onClick: () => console.log("exportar"),
  },
];

export function ReportsPage() {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <Stack gap={2}>
      <PageHeader
        title="Relatórios"
        subtitle="Histórico de consumo e análises do sistema">
        {headerButtons.map((button, index) => (
          <Button
            key={index}
            variant={button.variant}
            startIcon={button.icon}
            onClick={button.onClick}>
            {button.label}
          </Button>
        ))}
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

      {activeTab === 0 && <ConsumptionHistoryTab />}
      {activeTab === 1 && "Dashboard"}
    </Stack>
  );
}
