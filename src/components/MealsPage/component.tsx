"use client";

import { Button, Stack } from "@mui/material";
import React from "react";
import { AlertColor } from "@mui/material";

import PageHeader from "../PageHeader";
import {
  ConfiguracoesIcon,
  DownloadIcon,
  PaperIcon,
  PlusIcon,
  RefeicoesIcon,
} from "../Icons";
import TabButton from "../TabButton";
import NewMealTypeModal from "../Modals/NewMealTypeModal";
import MealTypesTab from "./Tabs/MealTypesTab";
import MealRulesTab from "./Tabs/MealRulesTab";
import MealRecordsTab from "./Tabs/MealRecordsTab";
import NewMealRecordModal from "../Modals/NewMealRecordModal";
import Toast from "../Toast";

export function MealsPage() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [openNewTypeModal, setOpenNewTypeModal] = React.useState(false);
  const [openManualRecordModal, setOpenManualRecordModal] =
    React.useState(false);
  const [mealRecordsRefreshKey, setMealRecordsRefreshKey] = React.useState(0);
  const [mealTypesRefreshKey, setMealTypesRefreshKey] = React.useState(0);
  const [toast, setToast] = React.useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
    duration: number;
  }>({
    open: false,
    message: "",
    severity: "info",
    duration: 3000,
  });

  const handleNotify = React.useCallback(
    (message: string, severity: AlertColor = "info", duration = 3000) => {
      setToast({ open: true, message, severity, duration });
    },
    [],
  );

  const closeToast = React.useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  const tabs = [
    { label: "Registros", icon: <PaperIcon height={24} /> },
    { label: "Tipos de Refeição", icon: <RefeicoesIcon height={24} /> },
    { label: "Regras de Consumo", icon: <ConfiguracoesIcon height={24} /> },
  ];

  return (
    <Stack gap={2}>
      <PageHeader
        title="Refeições"
        subtitle="Gerencie os registros e configurações de refeições">
        {activeTab === 0 && (
          <Stack direction={{md: "row"}} gap={1.5}>
            <Button
              variant="outlined"
              startIcon={<PlusIcon height={24} />}
              onClick={() => setOpenManualRecordModal(true)}>
              Registro Manual
            </Button>

            <Button
              variant="contained"
              startIcon={<DownloadIcon height={24} />}
              onClick={() => console.log("Exportar")}>
              Exportar
            </Button>
          </Stack>
        )}
        {activeTab === 1 && (
          <Button
            variant="contained"
            startIcon={<PlusIcon />}
            onClick={() => setOpenNewTypeModal(true)}>
            Novo Tipo de Refeição
          </Button>
        )}
      </PageHeader>

      <NewMealRecordModal
        isOpen={openManualRecordModal}
        onClose={() => setOpenManualRecordModal(false)}
        onSuccess={() => setMealRecordsRefreshKey((prev) => prev + 1)}
        onNotify={handleNotify}
      />

      <NewMealTypeModal
        open={openNewTypeModal}
        onClose={() => setOpenNewTypeModal(false)}
        onSuccess={() => setMealTypesRefreshKey((prev) => prev + 1)}
        onNotify={handleNotify}
      />

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

      {activeTab === 0 && <MealRecordsTab refreshKey={mealRecordsRefreshKey} />}
      {activeTab === 1 && (
        <MealTypesTab refreshKey={mealTypesRefreshKey} onNotify={handleNotify} />
      )}
      {activeTab === 2 && <MealRulesTab />}

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        autoHideDuration={toast.duration}
        onClose={closeToast}
      />
    </Stack>
  );
}
