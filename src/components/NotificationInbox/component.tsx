"use client";

import React from "react";
import { Box, useTheme } from "@mui/material";
import { Inbox } from "@novu/nextjs";
import { useUser } from "@/context/AuthContext";
import { getNovuSubscriberId } from "@/utils/userUtils";
import { NotificationInboxProps } from "./interface";

export function NotificationInbox({ className }: NotificationInboxProps) {
  const theme = useTheme();
  const { user, isAuthenticated, isLoadingPages } = useUser();

  const novuApplicationIdentifier = process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER;
  const novuSubscriberId = !isLoadingPages && isAuthenticated
    ? getNovuSubscriberId(user)
    : undefined;

  if (!novuApplicationIdentifier || !novuSubscriberId) {
    return null;
  }

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        "& .nv-inbox__popoverTrigger": {
          width: "44px !important",
          height: "44px !important",
          p: "0 !important",
          borderRadius: "12px !important",
          backgroundColor: "transparent !important",
          border: "none !important",
          outline: "none !important",
          boxShadow: "none !important",
          color: `${theme.palette.text.secondary} !important`,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04) !important",
            color: `${theme.palette.primary.main} !important`,
          },
          "&:active": {
            transform: "scale(0.95)",
          },
          "&:focus, &:focus-visible": {
            outline: "none !important",
            boxShadow: "none !important",
          },
        },
        "& .nv-bellContainer": {
          width: "24px !important",
          height: "24px !important",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        },
        "& .nv-bellSeverityGlow": {
          display: "none !important",
        },
        "& .nv-bellIcon": {
          width: "22px !important",
          height: "22px !important",
          minWidth: "22px !important",
          minHeight: "22px !important",
          color: "inherit !important",
          transition: "color 0.2s ease",
          "& stop": {
            stopColor: "currentColor !important",
          },
        },
        "& .nv-inbox__popoverTrigger:hover .nv-bellIcon": {
          color: `${theme.palette.primary.main} !important`,
        },
        "& .nv-bellDot": {
          width: "12px !important",
          height: "12px !important",
          top: "-1px !important",
          right: "-1px !important",
          backgroundColor: `${theme.palette.primary.main} !important`,
          border: `2px solid ${theme.palette.background.paper} !important`,
          borderRadius: "50% !important",
          boxShadow: "none !important",
        },
      }}
    >
      <Inbox
        applicationIdentifier={novuApplicationIdentifier}
        subscriberId={novuSubscriberId}
        appearance={{
          variables: {
            colorPrimary: theme.palette.primary.main,
            colorPrimaryForeground: theme.palette.primary.contrastText,
            colorBackground: theme.palette.background.paper,
            colorForeground: theme.palette.text.primary,
            colorSecondary: theme.palette.text.secondary,
            colorSecondaryForeground: theme.palette.secondary.contrastText,
            colorCounter: theme.palette.primary.main,
            colorCounterForeground: theme.palette.primary.contrastText,
            colorNeutral: theme.palette.divider,
            colorSeverityHigh: theme.palette.primary.main,
            colorSeverityMedium: theme.palette.warning.contrastText,
            colorSeverityLow: "transparent",
            colorRing: "transparent",
            colorShadow: "transparent",
            borderRadius: "12px",
            fontSize: "14px",
          },
          elements: {
            inbox__popoverTrigger: {
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: "transparent",
              color: theme.palette.text.secondary,
              border: "none",
              outline: "none",
              boxShadow: "none",
            },
            bellContainer: {
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            },
            bellSeverityGlow: {
              display: "none",
            },
            bellIcon: {
              width: "22px",
              height: "22px",
              color: theme.palette.text.secondary,
              "--bell-gradient-start": "currentColor",
              "--bell-gradient-end": "currentColor",
            },
            bellDot: {
              backgroundColor: theme.palette.primary.main,
              borderColor: theme.palette.background.paper,
              width: "8px",
              height: "8px",
              top: "-1px",
              right: "-1px",
            },
          },
        }}
      />
    </Box>
  );
}
