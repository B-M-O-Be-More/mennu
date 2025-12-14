"use client";

import {
  Box,
  Stack,
  Typography,
  Divider,
  Button,
  Avatar,
  useTheme,
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
  const isActive = (path: string) => {
    if (!activePath) return false;
    if (activePath === path) return true;
    // Para rotas aninhadas: /cardapios/criar deve ativar /cardapios
    if (path !== "/dashboard" && activePath.startsWith(path + "/")) {
      return true;
    }
    return false;
  };

  // Estilos base compartilhados para botões de menu
  const getMenuItemStyles = (itemActive: boolean) => ({
    justifyContent: "flex-start",
    paddingLeft: { xs: "1rem", sm: "1.125rem", lg: "20px" },
    paddingRight: "0",
    borderRadius: "16.4px",
    textTransform: "none",
    position: "relative",
    backgroundColor: itemActive ? sidebarColors.bgActive : "transparent",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: itemActive ? sidebarColors.bgActiveHover : sidebarColors.bgHover,
    },
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      top: "50%",
      transform: "translateY(-50%)",
      width: "4px",
      height: "32px",
      borderRadius: "0 4px 4px 0",
      backgroundColor: sidebarColors.indicator,
      opacity: itemActive ? 1 : 0,
      transition: "opacity 0.2s ease-in-out",
    },
    "& .MuiButton-startIcon": {
      marginRight: { xs: "0.75rem", sm: "0.875rem", lg: "16px" },
      display: "flex",
      alignItems: "center",
      transition: "color 0.2s ease-in-out",
    },
  });

  // Estilos para texto de menu
  const getMenuTextStyles = (itemActive: boolean) => ({
    fontFamily: "var(--font-poppins), Poppins, sans-serif",
    fontSize: { xs: "15px", sm: "16px", lg: "18px" },
    fontWeight: itemActive ? 600 : 500,
    lineHeight: "28px",
    color: itemActive ? sidebarColors.textActive : sidebarColors.text,
    letterSpacing: "-0.01em",
    textRendering: "optimizeLegibility",
    WebkitFontSmoothing: "antialiased",
    transition: "all 0.2s ease-in-out",
  });

  // Renderizar ícone com cor apropriada
  const renderIcon = (icon: React.ReactNode, isActive: boolean) => (
    <Box component="span" className="MuiButton-startIcon">
      {React.cloneElement(icon as React.ReactElement<{ color?: string }>, {
        color: isActive ? sidebarColors.textActive : sidebarColors.text,
      })}
    </Box>
  );

  return (
    <Box
      component="nav"
      role="navigation"
      aria-label="Menu principal"
      sx={{
        width: { xs: "240px", sm: "260px", lg: "279px" },
        height: "100vh",
        backgroundColor: "background.default",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        padding: { xs: "1rem 0 0 0", sm: "1.25rem 0 0 0", lg: "24px 0 0 0" },
        transition: "width 0.3s ease",
      }}
    >
      {/* Logo Container */}
      <Box
        sx={{
          width: { xs: "200px", sm: "215px", lg: "231px" },
          height: { xs: "56px", sm: "60px", lg: "64px" },
          backgroundColor: "background.auth",
          borderRadius: "16.4px",
          marginLeft: { xs: "1rem", sm: "1.25rem", lg: "24px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "var(--font-poppins), Poppins, sans-serif",
            fontSize: { xs: "20px", sm: "22px", lg: "24px" },
            fontWeight: 400,
            color: "white",
            lineHeight: "32px",
            letterSpacing: "-0.01em",
            textRendering: "optimizeLegibility",
            WebkitFontSmoothing: "antialiased",
          }}
        >
          Mennu
        </Typography>
      </Box>

      {/* Navigation Items */}
      <Stack
        sx={{
          marginTop: { xs: "2rem", sm: "2.5rem", lg: "48px" },
          paddingX: { xs: "0.75rem", sm: "0.875rem", lg: "16px" },
          paddingTop: 0,
          gap: "4px",
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
        }}
      >
        {menuItems.map((item) => {
          const itemActive = isActive(item.path);
          return (
            <Button
              key={item.id}
              component={NextLink}
              href={item.path}
              onClick={item.onClick}
              aria-current={itemActive ? "page" : undefined}
              aria-label={item.label}
              sx={{
                ...getMenuItemStyles(itemActive),
                height: { xs: "56px", sm: "58px", lg: "60px" },
                "& .MuiButton-startIcon": {
                  ...getMenuItemStyles(itemActive)["& .MuiButton-startIcon"],
                  "& svg": {
                    width: { xs: "22px", sm: "24px", lg: "28px" },
                    height: { xs: "22px", sm: "24px", lg: "28px" },
                  },
                },
              }}
            >
              {renderIcon(item.icon, itemActive)}
              <Typography sx={getMenuTextStyles(itemActive)}>
                {item.label}
              </Typography>
            </Button>
          );
        })}

        {/* Divider */}
        <Divider
          sx={{
            marginY: "1rem",
            borderColor: sidebarColors.divider,
          }}
        />

        {/* Administration Section */}
        {showAdminSection && (
          <>
            <Box
              sx={{
                paddingX: { xs: "1rem", sm: "1.125rem", lg: "20px" },
                paddingY: "0.5rem",
                height: "36px",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-poppins), Poppins, sans-serif",
                  fontSize: { xs: "12px", sm: "13px", lg: "14px" },
                  fontWeight: 400,
                  color: sidebarColors.section,
                  lineHeight: "20px",
                  letterSpacing: "0.01em",
                  textRendering: "optimizeLegibility",
                }}
              >
                Administração
              </Typography>
            </Box>

            {adminMenuItems.map((item) => {
              const itemActive = isActive(item.path);
              const isLongLabel = item.label === "Perfis & Permissões";
              
              return (
                <Button
                  key={item.id}
                  component={NextLink}
                  href={item.path}
                  onClick={item.onClick}
                  aria-current={itemActive ? "page" : undefined}
                  aria-label={item.label}
                  sx={{
                    ...getMenuItemStyles(itemActive),
                    height: isLongLabel 
                      ? { xs: "80px", sm: "84px", lg: "88px" } 
                      : { xs: "56px", sm: "58px", lg: "60px" },
                    "& .MuiButton-startIcon": {
                      ...getMenuItemStyles(itemActive)["& .MuiButton-startIcon"],
                      "& svg": {
                        width: isLongLabel 
                          ? { xs: "22px", sm: "24px", lg: "26.25px" }
                          : { xs: "22px", sm: "24px", lg: "28px" },
                        height: isLongLabel 
                          ? { xs: "22px", sm: "24px", lg: "26.25px" }
                          : { xs: "22px", sm: "24px", lg: "28px" },
                      },
                    },
                  }}
                >
                  {renderIcon(item.icon, itemActive)}
                  <Typography 
                    sx={{
                      ...getMenuTextStyles(itemActive),
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {item.label}
                  </Typography>
                </Button>
              );
            })}
          </>
        )}
      </Stack>

      {/* User Profile Section */}
      <Box
        role="contentinfo"
        aria-label="Perfil do usuário"
        sx={{
          padding: { xs: "1.25rem 1rem 0 1rem", sm: "1.375rem 1.25rem 0 1.25rem", lg: "25px 24px 0 24px" },
          borderTop: `1px solid ${sidebarColors.divider}`,
          paddingTop: { xs: "1.25rem", sm: "1.375rem", lg: "25px" },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            marginBottom: "1rem",
          }}
        >
          <Avatar
            sx={{
              width: { xs: "48px", sm: "52px", lg: "56px" },
              height: { xs: "48px", sm: "52px", lg: "56px" },
              backgroundColor: "background.auth",
              borderRadius: "50%",
              fontSize: { xs: "18px", sm: "19px", lg: "20px" },
              fontWeight: 400,
            }}
          >
            {user.avatarInitial || user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Stack>
            <Typography
              sx={{
                fontFamily: "var(--font-poppins), Poppins, sans-serif",
                fontSize: { xs: "15px", sm: "16px", lg: "18px" },
                fontWeight: 400,
                color: sidebarColors.userNameColor,
                lineHeight: "28px",
                letterSpacing: "-0.01em",
                textRendering: "optimizeLegibility",
              }}
            >
              {user.name}
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-poppins), Poppins, sans-serif",
                fontSize: { xs: "12px", sm: "13px", lg: "14px" },
                fontWeight: 400,
                color: sidebarColors.userEmailColor,
                lineHeight: "20px",
                letterSpacing: "0.01em",
                textRendering: "optimizeLegibility",
              }}
            >
              {user.email}
            </Typography>
          </Stack>
        </Stack>

        <Button
          onClick={onLogout}
          aria-label="Sair da aplicação"
          sx={{
            width: "100%",
            height: { xs: "48px", sm: "50px", lg: "52px" },
            borderRadius: "16.4px",
            textTransform: "none",
            justifyContent: "flex-start",
            paddingLeft: { xs: "0.875rem", sm: "0.9375rem", lg: "16px" },
            backgroundColor: "transparent",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: sidebarColors.bgHover,
            },
            "& .MuiButton-startIcon": {
              marginRight: { xs: "0.75rem", sm: "0.875rem", lg: "16px" },
              display: "flex",
              alignItems: "center",
              transition: "color 0.2s ease-in-out",
              "& svg": {
                width: { xs: "18px", sm: "20px", lg: "24px" },
                height: { xs: "18px", sm: "20px", lg: "24px" },
              },
            },
          }}
        >
          {renderIcon(logoutIcon, false)}
          <Typography
            sx={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              fontSize: { xs: "15px", sm: "16px", lg: "18px" },
              fontWeight: 500,
              lineHeight: "28px",
              color: sidebarColors.text,
              letterSpacing: "-0.01em",
              textRendering: "optimizeLegibility",
              WebkitFontSmoothing: "antialiased",
              transition: "color 0.2s ease-in-out",
            }}
          >
            Sair
          </Typography>
        </Button>

        <Typography
          sx={{
            fontFamily: "var(--font-poppins), Poppins, sans-serif",
            fontSize: { xs: "12px", sm: "13px", lg: "14px" },
            fontWeight: 400,
            color: sidebarColors.section,
            textAlign: "center",
            marginTop: "1rem",
            lineHeight: "20px",
            letterSpacing: "0.01em",
            textRendering: "optimizeLegibility",
          }}
        >
          Mennu — Gestão Inteligente
        </Typography>
      </Box>
    </Box>
  );
}

