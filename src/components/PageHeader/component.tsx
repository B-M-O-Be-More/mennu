"use client";

import React from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Inbox } from "@novu/nextjs";
import { PageHeaderProps } from "./interface";
import { useUser } from "@/context/AuthContext";
import { getNovuSubscriberId } from "@/utils/userUtils";

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  const theme = useTheme();
  const { user, isAuthenticated, isLoadingPages } = useUser();
  const [menu, setMenu] = React.useState<HTMLElement | null>(null);
  const open = Boolean(menu);
  const actions = React.Children.toArray(children);
  const novuApplicationIdentifier = process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER;
  const novuSubscriberId = !isLoadingPages && isAuthenticated
    ? getNovuSubscriberId(user)
    : undefined;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      gap={2}>
      <Box>
        <Typography variant="h4" component="h1" fontWeight={600}>
          {title}
        </Typography>

        {subtitle && (
          <Typography variant="subtitle2" component="h2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>

      <Stack direction="row" gap={2} alignItems="center">
        <Stack
          direction="row"
          gap={2}
          alignItems="center"
          sx={{ display: { xs: "none", md: "flex" } }}>
          {actions}
        </Stack>

        {novuApplicationIdentifier && novuSubscriberId && (
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
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
                borderRadius: "14px",
                fontSize: "14px",
              },
            }}
            />
          </Box>
        )}

        {actions.length > 0 && (
          <>
            <IconButton
              sx={{ display: { xs: "inline-flex", md: "none" } }}
              onClick={(e) => setMenu(e.currentTarget)}
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}>
              <MenuIcon sx={{ color: "grey.500" }} />
            </IconButton>

            <Menu
              anchorEl={menu}
              open={Boolean(menu)}
              onClose={() => setMenu(null)}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: 2,
                },
              }}>
              {actions.map((action, index) => (
                <MenuItem
                  disableRipple
                  key={index}
                  onClick={() => setMenu(null)}
                  sx={{
                    "& > *": {
                      width: "100%",
                    },
                  }}>
                  {action}
                </MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Stack>
    </Stack>
  );
}
