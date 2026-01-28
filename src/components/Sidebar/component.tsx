"use client";

import {
  Box,
  Stack,
  Typography,
  Divider,
  Button,
  Avatar,
  useTheme,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import * as React from "react";
import NextLink from "next/link";
import { SidebarProps } from "./interface";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function SidebarComponent({
  menuItems,
  adminMenuItems = [],
  user,
  onLogout,
  logoutIcon,
  showAdminSection = false,
  activePath,
}: SidebarProps) {
  const theme = useTheme();
  const sidebarColors = (theme.palette as any).sidebar;

  // Lógica de item ativo com suporte a rotas aninhadas
  const isActive = React.useCallback(
    (path: string) => {
      if (!activePath) return false;
      if (activePath === path) return true;
      // Para rotas aninhadas: /cardapios/criar deve ativar /cardapios
      if (path !== "/dashboard" && activePath.startsWith(path + "/")) {
        return true;
      }
      return false;
    },
    [activePath]
  );

  // Renderizar ícone com cor apropriada
  const renderIcon = React.useCallback(
    (icon: React.ReactNode, active: boolean) => (
      <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
        {React.cloneElement(icon as React.ReactElement<{ color?: string }>, {
          color: active ? sidebarColors.textActive : sidebarColors.text,
        })}
      </Box>
    ),
    [sidebarColors]
  );

  return (
    <Box
      component="nav"
      role="navigation"
      aria-label="Menu principal"
      sx={{
        width: { xs: 240, sm: 260, lg: 279 },
        height: "100vh",
        bgcolor: "sidebar.background",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        pt: { xs: 2, sm: 2.5, lg: 3 },
        transition: "width 0.3s ease",
        borderRight: 1,
        borderColor: "sidebar.divider",
      }}
    >
      {/* Logo Container */}
      <Box
        sx={{
          width: { xs: 200, sm: 215, lg: 231 },
          height: { xs: 56, sm: 60, lg: 64 },
          bgcolor: "background.auth",
          borderRadius: 2.05,
          ml: { xs: 2, sm: 2.5, lg: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          component="h1"
          sx={{
            fontSize: { xs: 20, sm: 22, lg: 24 },
            fontWeight: 400,
            color: "common.white",
            letterSpacing: "-0.01em",
          }}
        >
          Mennu
        </Typography>
      </Box>

      {/* Navigation Items */}
      <List
        component="div"
        disablePadding
        sx={{
          mt: { xs: 4, sm: 5, lg: 6 },
          px: { xs: 1.5, sm: 1.75, lg: 2 },
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
          "& > *:not(:last-child)": {
            mb: 0.5,
          },
        }}
      >
        {menuItems.map((item) => {
          const itemActive = isActive(item.path);
          return (
            <ListItemButton
              key={item.id}
              component={NextLink}
              href={item.path}
              onClick={item.onClick}
              selected={itemActive}
              aria-current={itemActive ? "page" : undefined}
              aria-label={item.label}
              sx={{
                pl: { xs: 2, sm: 2.25, lg: 2.5 },
                pr: 0,
                borderRadius: 2.05,
                height: { xs: 56, sm: 58, lg: 60 },
                position: "relative",
                transition: theme.transitions.create(
                  ["background-color", "color"],
                  { duration: theme.transitions.duration.shorter }
                ),
                "&.Mui-selected": {
                  bgcolor: "sidebar.bgActive",
                  "&:hover": {
                    bgcolor: "sidebar.bgActiveHover",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 4,
                    height: 32,
                    borderRadius: "0 4px 4px 0",
                    bgcolor: "sidebar.indicator",
                  },
                },
                "&:hover": {
                  bgcolor: "sidebar.bgHover",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: { xs: 38, sm: 42, lg: 44 },
                  "& svg": {
                    width: { xs: 22, sm: 24, lg: 28 },
                    height: { xs: 22, sm: 24, lg: 28 },
                  },
                }}
              >
                {renderIcon(item.icon, itemActive)}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: { xs: 15, sm: 16, lg: 18 },
                  fontWeight: itemActive ? 600 : 500,
                  color: itemActive ? "sidebar.textActive" : "sidebar.text",
                  letterSpacing: "-0.01em",
                }}
              />
            </ListItemButton>
          );
        })}

        <Divider
          component="li"
          sx={{
            my: 2,
            borderColor: "sidebar.divider",
          }}
        />

        {/* Administration Section */}
        {showAdminSection && (
          <>
            <Box
              component="li"
              sx={{
                px: { xs: 2, sm: 2.25, lg: 2.5 },
                py: 1,
                height: 36,
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  fontSize: { xs: 12, sm: 13, lg: 14 },
                  fontWeight: 400,
                  color: "sidebar.section",
                  letterSpacing: "0.01em",
                  lineHeight: 1.43,
                }}
              >
                Administração
              </Typography>
            </Box>

            {adminMenuItems.map((item) => {
              const itemActive = isActive(item.path);

              return (
                <ListItemButton
                  key={item.id}
                  component={NextLink}
                  href={item.path}
                  onClick={item.onClick}
                  selected={itemActive}
                  aria-current={itemActive ? "page" : undefined}
                  aria-label={item.label}
                  sx={{
                    pl: { xs: 2, sm: 2.25, lg: 2.5 },
                    pr: 0,
                    borderRadius: 2.05,
                    height: { xs: 56, sm: 58, lg: 60 },
                    position: "relative",
                    transition: theme.transitions.create(
                      ["background-color", "color"],
                      { duration: theme.transitions.duration.shorter }
                    ),
                    "&.Mui-selected": {
                      bgcolor: "sidebar.bgActive",
                      "&:hover": {
                        bgcolor: "sidebar.bgActiveHover",
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 4,
                        height: 32,
                        borderRadius: "0 4px 4px 0",
                        bgcolor: "sidebar.indicator",
                      },
                    },
                    "&:hover": {
                      bgcolor: "sidebar.bgHover",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: { xs: 38, sm: 42, lg: 44 },
                      "& svg": {
                        width: { xs: 22, sm: 24, lg: 28 },
                        height: { xs: 22, sm: 24, lg: 28 },
                      },
                    }}
                  >
                    {renderIcon(item.icon, itemActive)}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: { xs: 15, sm: 16, lg: 18 },
                      fontWeight: itemActive ? 600 : 500,
                      color: itemActive ? "sidebar.textActive" : "sidebar.text",
                      letterSpacing: "-0.01em",
                    }}
                  />
                </ListItemButton>
              );
            })}
          </>
        )}
      </List>

      {/* User Profile Section */}
      <Box
        role="contentinfo"
        aria-label="Perfil do usuário"
        sx={{
          p: { xs: "1.25rem 1rem 1rem", sm: "1.375rem 1.25rem 1.25rem", lg: "1.5625rem 1.5rem 1.5rem" },
          borderTop: 1,
          borderColor: "sidebar.divider",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Avatar
            sx={{
              width: { xs: 48, sm: 52, lg: 56 },
              height: { xs: 48, sm: 52, lg: 56 },
              bgcolor: "background.auth",
              fontSize: { xs: 18, sm: 19, lg: 20 },
              fontWeight: 400,
            }}
          >
            {user.avatarInitial || user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Stack spacing={0.25}>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: 15, sm: 16, lg: 18 },
                fontWeight: 400,
                color: "sidebar.userNameColor",
                letterSpacing: "-0.01em",
              }}
            >
              {user.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: 12, sm: 13, lg: 14 },
                fontWeight: 400,
                color: "sidebar.userEmailColor",
                letterSpacing: "0.01em",
              }}
            >
              {user.email}
            </Typography>
          </Stack>
        </Stack>

        <Button
          onClick={onLogout}
          fullWidth
          aria-label="Sair da aplicação"
          startIcon={renderIcon(logoutIcon, false)}
          sx={{
            height: { xs: 48, sm: 50, lg: 52 },
            borderRadius: 2.05,
            justifyContent: "flex-start",
            pl: { xs: 1.75, sm: 1.875, lg: 2 },
            textTransform: "none",
            bgcolor: "transparent",
            transition: theme.transitions.create("background-color", {
              duration: theme.transitions.duration.shorter,
            }),
            "&:hover": {
              bgcolor: "sidebar.bgHover",
            },
            "& .MuiButton-startIcon": {
              mr: { xs: 1.5, sm: 1.75, lg: 2 },
              "& svg": {
                width: { xs: 18, sm: 20, lg: 24 },
                height: { xs: 18, sm: 20, lg: 24 },
              },
            },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 15, sm: 16, lg: 18 },
              fontWeight: 500,
              color: "sidebar.text",
              letterSpacing: "-0.01em",
            }}
          >
            Sair
          </Typography>
        </Button>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            fontSize: { xs: 12, sm: 13, lg: 14 },
            fontWeight: 400,
            color: "sidebar.section",
            textAlign: "center",
            mt: 2,
            letterSpacing: "0.01em",
          }}
        >
          Mennu — Gestão Inteligente
        </Typography>
      </Box>
    </Box>
  );
}

