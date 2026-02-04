"use client";

import { Button, Stack } from "@mui/material";
import { SettingsPageProps } from "./index";
import React from "react";
import Card from "../Cards/Card";
import { tabsSettings } from "@/data/infos";
import PageHeader from "../PageHeader";
export function SettingsPage({ }: SettingsPageProps) {
  const [tab, setTab] = React.useState(0);

  return (
    <Stack gap={2} height={"100%"} maxHeight={"100%"}>
      <PageHeader
        title="Configurações"
        subtitle="Gerencie as configurações do sistema"
      />
      <Stack direction={"row"} gap={2} height={"100%"}>
        <Card sx={{ flex: 0.3, minWidth: "200px", height: "100%" }} >
          {tabsSettings.map((tabItem, index) => {
            const color = index === tab ? "primary.main" : "#4A5565";
            const backgroundColor = index === tab ? "#FFE9E3" : "transparent";
            return (
              <Button
                key={index}
                startIcon={tabItem.icon}
                variant="text"
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
                onClick={() => setTab(index)}
              >
                {tabItem.label}
              </Button>
            );
          })}
        </Card>
        <Card sx={{ flex: 1, height: "fit-content", padding: 2 }} >
          {tabsSettings[tab].tabComponent}
        </Card>
      </Stack>
    </Stack>
  );
}
