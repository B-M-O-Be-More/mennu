"use client";

import { Button, Stack } from "@mui/material";
import React from "react";

import PageHeader from "../PageHeader";
import { DownloadIcon, PaperIcon, PlusIcon } from "../Icons";
import { ConfiguracoesIcon, RefeicoesIcon } from "../Sidebar/icons";
import TabButton from "../TabButton";

export function MealsPage() {
  const [activeTab, setActiveTab] = React.useState(0);

  const tabs = [
    { label: "Registros", icon: <PaperIcon /> },
    { label: "Tipos de Refeição", icon: <RefeicoesIcon /> },
    { label: "Regras de Consumo", icon: <ConfiguracoesIcon /> },
  ];

  return (
    <Stack gap={2}>
      <PageHeader
        title="Refeições"
        subtitle="Gerencie os registros e configurações de refeições">
        {activeTab === 0 && (
          <>
            <Button variant="outlined" startIcon={<PlusIcon />}>
              Registro Manual
            </Button>
            <Button variant="contained" startIcon={<DownloadIcon />}>
              Exportar
            </Button>
          </>
        )}
        {activeTab === 1 && (
          <Button variant="contained" startIcon={<PlusIcon />}>
            Novo Tipo de Refeição
          </Button>
        )}
      </PageHeader>

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

      {activeTab === 0 && "Registros"}
      {activeTab === 1 && "Tipos de Refeição"}
      {activeTab === 2 && "Regras de Consumo"}
    </Stack>
  );
}
