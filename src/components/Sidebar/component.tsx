"use client";

import {
  Box,
  Stack,
  Typography,
  Divider,
  ButtonBase,
  Avatar,
  useTheme,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Theme,
} from "@mui/material";
import * as React from "react";
import NextLink from "next/link";
import Image from "next/image";
import { SidebarProps } from "./interface";
import { SidebarMenuItem } from "@/Interfaces/Sidebar/menuItem";
import Can from "@/components/Can";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Sub-componentes internos ────────────────────────────────────────────────

interface NavItemProps {
  item: SidebarMenuItem;
  active: boolean;
  theme: Theme;
  renderIcon: (icon: React.ReactNode, active: boolean) => React.ReactNode;
}

function NavItem({ item, active, theme, renderIcon }: NavItemProps) {
  return (
    <ListItemButton
      component={NextLink}
      href={item.path}
      onClick={item.onClick}
      selected={active}
      aria-current={active ? "page" : undefined}
      aria-label={item.label}
      sx={{
        pl: { xs: 2, sm: 2.25, lg: 2.5 },
        pr: 0,
        borderRadius: 2.05,
        height: { xs: 52, sm: 54, lg: 56 },
        position: "relative",
        transition: theme.transitions.create(["background-color", "color"], {
          duration: theme.transitions.duration.shorter,
        }),
        "&.Mui-selected": {
          bgcolor: "sidebar.bgActive",
          "&:hover": { bgcolor: "sidebar.bgActiveHover" },
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
        "&:hover": { bgcolor: "sidebar.bgHover" },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: { xs: 34, sm: 38, lg: 40 },
          "& svg": {
            width: { xs: 20, sm: 22, lg: 24 },
            height: { xs: 20, sm: 22, lg: 24 },
          },
        }}
      >
        {renderIcon(item.icon, active)}
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        slotProps={{
          primary: {
            fontSize: { xs: 14, sm: 15, lg: 16 },
            fontWeight: active ? 600 : 500,
            color: active ? "sidebar.textActive" : "sidebar.text",
            letterSpacing: "-0.01em",
          },
        }}
      />
    </ListItemButton>
  );
}

interface ProfileMenuActionProps {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  renderIcon: (icon: React.ReactNode, active: boolean) => React.ReactNode;
}

function ProfileMenuAction({ label, icon, onClick, renderIcon }: ProfileMenuActionProps) {
  return (
    <MenuItem
      onClick={onClick}
      sx={{
        gap: 1.5,
        py: { xs: 1.25, lg: 1.5 },
        px: { xs: 1.5, lg: 2 },
        borderRadius: 1.5,
        mx: 0.5,
        my: 0.5,
        "&:hover": { bgcolor: "sidebar.bgHover" },
      }}
    >
      {icon ? (
        <Box sx={{ display: "flex", alignItems: "center", "& svg": { width: 20, height: 20 } }}>
          {renderIcon(icon, false)}
        </Box>
      ) : null}
      <Typography
        sx={{
          fontSize: { xs: 14, sm: 15, lg: 16 },
          fontWeight: 500,
          color: "sidebar.text",
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </Typography>
    </MenuItem>
  );
}

interface SidebarLogoProps {
  logoSrc?: string;
}

function SidebarLogo({ logoSrc }: SidebarLogoProps) {
  if (logoSrc) {
    return (
      <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
        <Image
          src={logoSrc}
          alt="Logo"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </Box>
    );
  }

  return (
    <Typography
      variant="h6"
      component="h1"
      sx={{
        fontSize: { xs: 18, sm: 20, lg: 22 },
        fontWeight: 400,
        color: "common.white",
        letterSpacing: "-0.01em",
      }}
    >
      Mennu
    </Typography>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export function SidebarComponent({
  menuItems,
  adminMenuItems = [],
  user,
  onLogout,
  logoutIcon,
  activeUnit,
  onSwitchUnit,
  switchUnitIcon,
  showAdminSection = false,
  activePath,
  logoSrc,
}: SidebarProps) {
  const theme = useTheme();
  const sidebarColors = (theme.palette as any).sidebar;

  const isActive = React.useCallback(
    (path: string) => {
      if (!activePath) return false;
      if (activePath === path) return true;
      if (path !== "/dashboard" && activePath.startsWith(path + "/")) return true;
      return false;
    },
    [activePath]
  );

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

  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);
  const menuOpen = Boolean(menuAnchor);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    onLogout?.();
  };

  const handleSwitchUnit = () => {
    handleCloseMenu();
    onSwitchUnit?.();
  };

  return (
    <Box
      component="nav"
      role="navigation"
      aria-label="Menu principal"
      sx={{
        width: { xs: 224, sm: 240, lg: 256 },
        flexShrink: 0,
        height: "100%",
        maxHeight: "100dvh",
        overflow: "hidden",
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
      {/* Logo */}
      <Box
        sx={{
          width: { xs: 188, sm: 202, lg: 216 },
          height: { xs: 52, sm: 56, lg: 60 },
          flexShrink: 0,
          bgcolor: "background.auth",
          borderRadius: 2.05,
          ml: { xs: 2, sm: 2.5, lg: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <SidebarLogo logoSrc={logoSrc} />
      </Box>

      {/* Navegação */}
      <List
        component="div"
        disablePadding
        sx={{
          mt: { xs: 4, sm: 5, lg: 6 },
          px: { xs: 1.5, sm: 1.75, lg: 2 },
          flex: 1,
          overflowY: "auto",
          overscrollBehavior: "contain",
          minHeight: 0,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: 3,
            backgroundColor: "sidebar.divider",
          },
          scrollbarWidth: "thin",
          "& > *:not(:last-child)": { mb: 0.5 },
        }}
      >
        {menuItems.map((item) => (
          <Can key={item.id} permissions={item.permissions}>
            <NavItem
              item={item}
              active={isActive(item.path)}
              theme={theme}
              renderIcon={renderIcon}
            />
          </Can>
        ))}

        <Divider component="li" sx={{ my: 2, borderColor: "sidebar.divider" }} />

        {/* Seção administrativa — visível apenas com permissão */}
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

            {adminMenuItems.map((item) => (
              <Can key={item.id} permissions={item.permissions}>
                <NavItem
                  item={item}
                  active={isActive(item.path)}
                  theme={theme}
                  renderIcon={renderIcon}
                />
              </Can>
            ))}
          </>
        )}
      </List>

      {/* Perfil do usuário */}
      <Box
        role="contentinfo"
        aria-label="Perfil do usuário"
        sx={{
          p: {
            xs: "1.25rem 1rem 1rem",
            sm: "1.375rem 1.25rem 1.25rem",
            lg: "1.5625rem 1.5rem 1.5rem",
          },
          flexShrink: 0,
          borderTop: 1,
          borderColor: "sidebar.divider",
        }}
      >
        {activeUnit && (
          <Stack
            spacing={0.25}
            sx={{
              mb: { xs: 1, lg: 1.25 },
              px: { xs: 1, lg: 1.25 },
              py: { xs: 0.75, lg: 1 },
              borderRadius: 2.05,
              bgcolor: "sidebar.bgActive",
            }}
          >
            <Typography
              variant="overline"
              sx={{
                fontSize: 10,
                fontWeight: 500,
                lineHeight: 1.4,
                color: "sidebar.section",
                letterSpacing: "0.08em",
              }}
            >
              Unidade
            </Typography>
            <Typography
              noWrap
              title={activeUnit.unidade}
              sx={{
                fontSize: { xs: 13, sm: 14 },
                fontWeight: 600,
                color: "sidebar.textActive",
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
              }}
            >
              {activeUnit.unidade}
            </Typography>
            {activeUnit.empresa ? (
              <Typography
                noWrap
                title={activeUnit.empresa}
                sx={{
                  fontSize: 11,
                  fontWeight: 400,
                  color: "sidebar.userEmailColor",
                  lineHeight: 1.3,
                }}
              >
                {activeUnit.empresa}
              </Typography>
            ) : null}
          </Stack>
        )}

        <ButtonBase
          onClick={handleOpenMenu}
          aria-label="Opções do perfil"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          sx={{
            width: "100%",
            borderRadius: 2.05,
            p: { xs: 0.75, sm: 0.875, lg: 1 },
            transition: theme.transitions.create("background-color", {
              duration: theme.transitions.duration.shorter,
            }),
            "&:hover": { bgcolor: "sidebar.bgHover" },
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: "100%" }}>
            <Avatar
              sx={{
                width: { xs: 40, sm: 44, lg: 48 },
                height: { xs: 40, sm: 44, lg: 48 },
                bgcolor: "background.auth",
                fontSize: { xs: 16, sm: 17, lg: 18 },
                fontWeight: 400,
                flexShrink: 0,
              }}
            >
              {user.avatarInitial || user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1, textAlign: "left" }}>
              <Typography
                noWrap
                sx={{
                  fontSize: { xs: 14, sm: 15, lg: 16 },
                  fontWeight: 500,
                  color: "sidebar.userNameColor",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}
              >
                {user.name}
              </Typography>
              <Typography
                noWrap
                title={user.email}
                sx={{
                  fontSize: { xs: 11, sm: 11, lg: 12 },
                  fontWeight: 400,
                  color: "sidebar.userEmailColor",
                  letterSpacing: "0.01em",
                  lineHeight: 1.3,
                }}
              >
                {user.email}
              </Typography>
            </Stack>
          </Stack>
        </ButtonBase>

        {/* Menu de ações do perfil */}
        <Menu
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "bottom", horizontal: "center" }}
          slotProps={{
            paper: {
              elevation: 3,
              sx: {
                minWidth: { xs: 188, sm: 202, lg: 216 },
                borderRadius: 2.05,
                mt: -1,
              },
            },
          }}
        >
          {onSwitchUnit ? (
            <ProfileMenuAction
              label="Trocar unidade"
              icon={switchUnitIcon}
              onClick={handleSwitchUnit}
              renderIcon={renderIcon}
            />
          ) : null}

          {onSwitchUnit ? (
            <Divider sx={{ my: 0.5, borderColor: "sidebar.divider" }} />
          ) : null}

          <ProfileMenuAction
            label="Sair"
            icon={logoutIcon}
            onClick={handleLogout}
            renderIcon={renderIcon}
          />
        </Menu>

      </Box>
    </Box>
  );
}
