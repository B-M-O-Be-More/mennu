"use client";

import { Button, Stack, Typography, Box } from "@mui/material";
import { SettingsPageProps } from "./index";
import React from "react";
import Card from "../Cards/Card";
import { tabsSettings } from "@/data/infos";
export function SettingsPage({ }: SettingsPageProps) {
  const [tab, setTab] = React.useState(0);

  return (
    <Stack gap={2}>
      <Box component="span">
        <Typography variant="h1" fontWeight={"600"} color="text.primary">
          Configurações
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" fontWeight={400}>
          Visão geral das operações do dia
        </Typography>
      </Box>
      <Stack direction={"row"} gap={2} >
        <Card sx={{ flex: 0.3, minWidth: "200px", height: "fit-content" }}>
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
                  paddingY: 1.5,
                  paddingX: 2,
                  fontSize: 14,
                  fontWeight: 400
                }}
                onClick={() => setTab(index)}
              >
                {tabItem.label}
              </Button>
            );
          })}
        </Card>
        <Card sx={{ flex: 1 }}>
          {tabsSettings[tab].tabComponent}
        </Card>
      </Stack>
    </Stack>
  );
}
