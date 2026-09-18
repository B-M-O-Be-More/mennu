"use client";

import { Button, Stack } from "@mui/material";
import { SettingsPageProps } from "./index";
import React from "react";
import Card from "../Cards/Card";
import { tabsSettings } from "@/data/infos";
import PageHeader from "../PageHeader";
export function SettingsPage({ }: SettingsPageProps) {
  const [activeTabId, setActiveTabId] = React.useState(tabsSettings[0].id);
  const activeTab =
    tabsSettings.find((tabItem) => tabItem.id === activeTabId) ?? tabsSettings[0];

  return (
    <Stack gap={2} height={"100%"} maxHeight={"100%"}>
      <PageHeader
        title="Configurações"
        subtitle="Gerencie as configurações do sistema"
      />
      <Stack
        direction={{ xs: "column", md: "row" }}
        gap={2}
        height={"100%"}
        minWidth={0}
      >
        <Card
          sx={{
            flex: { xs: "none", md: 0.3 },
            flexDirection: { xs: "row", md: "column" },
            minWidth: { xs: 0, md: "200px" },
            maxWidth: "100%",
            height: { xs: "auto", md: "100%" },
            overflowX: { xs: "auto", md: "visible" },
            "& > button": { flexShrink: 0 },
          }}
        >
          {tabsSettings.map((tabItem) => {
            const selected = tabItem.id === activeTabId;
            const color = selected ? "primary.main" : "#4A5565";
            const backgroundColor = selected ? "#FFE9E3" : "transparent";
            return (
              <Button
                key={tabItem.id}
                startIcon={tabItem.icon}
                variant="text"
                aria-pressed={selected}
                sx={{
                  color,
                  backgroundColor,
                  borderRadius: "1rem",
                  justifyContent: "flex-start",
                  textTransform: "none",
                  paddingY: 1,
                  paddingX: 2,
                  fontSize: 16,
                  fontWeight: 400
                }}
                onClick={() => setActiveTabId(tabItem.id)}
              >
                {tabItem.label}
              </Button>
            );
          })}
        </Card>
        <Card sx={{ flex: 1, minWidth: 0, height: "fit-content", padding: 2 }} >
          {activeTab.tabComponent}
        </Card>
      </Stack>
    </Stack>
  );
}
