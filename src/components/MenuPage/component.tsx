"use client";

import { Button, Stack } from "@mui/material";
import { MenuPageProps } from "./";
import PageHeader from "../PageHeader";
import { CalendarIcon, CookHatIcon, CopyIcon, MarkedCalendarIcon, PaperIcon, PlusIcon, StatsIcon } from "../Icons";
import React from "react";
import type { Dayjs } from "dayjs";
import TabButton from "../TabButton";
import MenusTab from "./Tabs/MenusTab";
import ItemsTab from "./Tabs/ItemsTab";
import ConsumptionTab from "./Tabs/ConsumptionTab";
import ReportsTab from "./Tabs/ReportsTab";
import NewMenuModal from "../Modals/NewMenuModal";
import NewMenuItemModal from "../Modals/NewMenuItemModal";
import NewManualRegisterModal from "../Modals/NewManualRegisterModal";

import MenuPeriodModal from "../Modals/MenuPeriodModal";

const tabs = [
  { label: "Cardápios", icon: <CalendarIcon height={24} /> },
  { label: "Itens", icon: <CookHatIcon height={24} /> },
  { label: "Consumo", icon: <PaperIcon height={24} /> },
  { label: "Relatórios", icon: <StatsIcon height={24} /> },
];

type PeriodFilter = { start: Dayjs; end: Dayjs } | null;

export function MenuPage({ }: MenuPageProps) {
  const [activeTab, setActiveTab] = React.useState(0);

  const [openCreateMenuModal, setOpenCreateMenuModal] = React.useState(false);
  const [openMenuPeriodModal, setOpenMenuPeriodModal] = React.useState(false);

  const [openCreateMenuItemModal, setOpenCreateMenuItemModal] = React.useState(false);
  const [openManualRegisterModal, setOpenManualRegisterModal] = React.useState(false);

 
  const [periodFilter, setPeriodFilter] = React.useState<PeriodFilter>(null);

  const handleApplyPeriodFilter = (data: { start: Dayjs | null; end: Dayjs | null }) => {
    if (!data.start || !data.end) {
      setPeriodFilter(null);
      return;
    }

    setPeriodFilter({
      start: data.start,
      end: data.end,
    });
  };

  const handleCopyMenu = () => {
    console.log("Copiar");
  };

  return (
    <Stack gap={2}>
      <PageHeader
        title="Cardápios"
        subtitle="Gerencie os cardápios das refeições"
      >
        {
          activeTab === 0 &&
          <React.Fragment>
            <Button
              variant="outlined"
              startIcon={<CopyIcon />}
              onClick={handleCopyMenu}
            >
              Copiar
            </Button>
            <Button
              variant="outlined"
              startIcon={<MarkedCalendarIcon />}
              onClick={() => setOpenMenuPeriodModal(true)}
            >
              Período
            </Button>

            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={() => setOpenCreateMenuModal(true)}
            >
              Novo Cardápio
            </Button>

            <NewMenuModal
              open={openCreateMenuModal}
              onClose={() => setOpenCreateMenuModal(false)}
            />

            {}
            <MenuPeriodModal
              open={openMenuPeriodModal}
              onClose={() => setOpenMenuPeriodModal(false)}
              onApply={handleApplyPeriodFilter}
            />
          </React.Fragment>
        }

        {
          activeTab === 1 &&
          <React.Fragment>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={() => setOpenCreateMenuItemModal(true)}
            >
              Novo Item
            </Button>

            <NewMenuItemModal
              open={openCreateMenuItemModal}
              onClose={() => setOpenCreateMenuItemModal(false)}
            />
          </React.Fragment>
        }

        {
          activeTab === 2 &&
          <React.Fragment>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={() => setOpenManualRegisterModal(true)}
            >
              Registro Manual
            </Button>

            <NewManualRegisterModal
              open={openManualRegisterModal}
              onClose={() => setOpenManualRegisterModal(false)}
            />
          </React.Fragment>
        }

        {
          activeTab === 3 &&
          <React.Fragment>
            <Button
              variant="contained"
              startIcon={<PlusIcon />}
              onClick={() => {
                console.log("Exportar CSV");
              }}
            >
              Exportar CSV
            </Button>
          </React.Fragment>
        }

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

      {}
      {activeTab === 0 && <MenusTab periodFilter={periodFilter} />}
      {activeTab === 1 && <ItemsTab />}
      {activeTab === 2 && <ConsumptionTab />}
      {activeTab === 3 && <ReportsTab />}
    </Stack >
  );
}