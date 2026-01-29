"use client";

import { Button, Stack } from "@mui/material";
import React from "react";

import PageHeader from "../PageHeader";
import { DownloadIcon, PaperIcon, PlusIcon } from "../Icons";
import { ConfiguracoesIcon, RefeicoesIcon } from "../Sidebar/icons";
import TabButton from "../TabButton";
import NewMealTypeModal from "../Modals/NewMealTypeModal";
import MealTypesTab from "./Tabs/MealTypesTab";
import MealRulesTab from "./Tabs/MealRulesTab";

export function MealsPage() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [openNewTypeModal, setOpenNewTypeModal] = React.useState(false);

  const tabs = [
    { label: "Registros", icon: <PaperIcon /> },
    { label: "Tipos de Refeição", icon: <RefeicoesIcon height={22} /> },
    { label: "Regras de Consumo", icon: <ConfiguracoesIcon height={24} /> },
  ];

  return (
    <Stack gap={2}>
      <PageHeader
        title="Refeições"
        subtitle="Gerencie os registros e configurações de refeições">
        {activeTab === 0 && (
          <>
            <Button
              variant="outlined"
              startIcon={<PlusIcon />}
              sx={{ maxHeight: "60px" }}>
              Registro Manual
            </Button>
            <Button variant="contained" startIcon={<DownloadIcon />}>
              Exportar
            </Button>
          </>
        )}
        {activeTab === 1 && (
          <>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={() => setOpenNewTypeModal(true)}>
              Novo Tipo de Refeição
            </Button>

            <NewMealTypeModal
              open={openNewTypeModal}
              onClose={() => setOpenNewTypeModal(false)}
            />
          </>
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
      {activeTab === 1 && <MealTypesTab />}
      {activeTab === 2 && <MealRulesTab />}
    </Stack>
  );
}
