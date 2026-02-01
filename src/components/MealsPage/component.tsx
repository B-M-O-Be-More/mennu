"use client";

import { Button, Stack } from "@mui/material";
import React from "react";

import PageHeader from "../PageHeader";
import { ConfiguracoesIcon, DownloadIcon, PaperIcon, PlusIcon, RefeicoesIcon } from "../Icons";
import TabButton from "../TabButton";
import NewMealTypeModal from "../Modals/NewMealTypeModal";
import MealTypesTab from "./Tabs/MealTypesTab";
import MealRulesTab from "./Tabs/MealRulesTab";
import MealRecordsTab from "./Tabs/MealRecordsTab";
import NewMealRecordModal from "../Modals/NewMealRecordModal";

export function MealsPage() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [openNewTypeModal, setOpenNewTypeModal] = React.useState(false);
  const [openManualRecordModal, setOpenManualRecordModal] =
    React.useState(false);

  const tabs = [
    { label: "Registros", icon: <PaperIcon height={24} /> },
    { label: "Tipos de Refeição", icon: <RefeicoesIcon height={24} /> },
    { label: "Regras de Consumo", icon: <ConfiguracoesIcon height={24} /> },
  ];

  return (
    <Stack gap={2}>
      <PageHeader
        title="Refeições"
        subtitle="Gerencie os registros e configurações de refeições"
      >
        {activeTab === 0 && (
          <>
            <Button
              variant="outlined"
              startIcon={<PlusIcon style={{ padding: 0 }} />}
              sx={{
                maxHeight: "60px",
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.8rem",
                  md: "0.9rem",
                },
              }}
              onClick={() => setOpenManualRecordModal(true)}>
              Registro Manual
            </Button>
            <NewMealRecordModal
              isOpen={openManualRecordModal}
              onClose={() => setOpenManualRecordModal(false)}
            />

            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.8rem",
                  md: "0.9rem",
                },
              }}>
              Exportar
            </Button>
          </>
        )}
        {activeTab === 1 && (
          <>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              sx={{
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.8rem",
                  md: "0.9rem",
                },
              }}
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

      {activeTab === 0 && <MealRecordsTab />}
      {activeTab === 1 && <MealTypesTab />}
      {activeTab === 2 && <MealRulesTab />}
    </Stack>
  );
}
