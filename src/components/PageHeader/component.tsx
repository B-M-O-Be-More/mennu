"use client";

import React from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationInbox from "@/components/NotificationInbox";
import { PageHeaderProps } from "./interface";

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  const [menu, setMenu] = React.useState<HTMLElement | null>(null);
  const open = Boolean(menu);
  const actions = React.Children.toArray(children);

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

        <NotificationInbox />

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
