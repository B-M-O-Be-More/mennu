"use client";

import { Button, Stack, Tooltip } from "@mui/material";
import { MenuPageProps } from "./";
import PageHeader from "../PageHeader";
import { CalendarIcon, PaperIcon, PlusIcon, StatsIcon } from "../Icons";
import React from "react";
import TabButton from "../TabButton";
import MenusTab from "./Tabs/MenusTab";
import ConsumptionTab from "./Tabs/ConsumptionTab";
import ReportsTab from "./Tabs/ReportsTab";
import NewMenuModal from "../Modals/NewMenuModal";
import NewManualRegisterModal from "../Modals/NewManualRegisterModal";

const tabs = [
  { label: "Cardápios", icon: <CalendarIcon height={24} /> },
  { label: "Consumo", icon: <PaperIcon height={24} /> },
  { label: "Relatórios", icon: <StatsIcon height={24} /> },
];

export function MenuPage({ }: MenuPageProps) {
  const [activeTab, setActiveTab] = React.useState(0);
  const [menusRefreshKey, setMenusRefreshKey] = React.useState(0);

  const [openCreateMenuModal, setOpenCreateMenuModal] = React.useState(false);
  const [openManualRegisterModal, setOpenManualRegisterModal] = React.useState(false);

  return (
    <Stack gap={2}>
      <PageHeader
        title="Cardápios"
        subtitle="Gerencie os cardápios das refeições"
      >
        {
          activeTab === 0 &&
          <React.Fragment>
            <Tooltip title="Em breve">
              <span>
                <Button variant="outlined" disabled>
                  Copiar
                </Button>
              </span>
            </Tooltip>

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
              onCreated={() => setMenusRefreshKey((prev) => prev + 1)}
            />
          </React.Fragment>
        }

        {
          activeTab === 1 &&
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

      </PageHeader>

      <Stack direction={"row"} gap={2} flexWrap="wrap">
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

      {activeTab === 0 && <MenusTab key={menusRefreshKey} />}
      {activeTab === 1 && <ConsumptionTab />}
      {activeTab === 2 && <ReportsTab />}
    </Stack >
  );
}
