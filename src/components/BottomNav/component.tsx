"use client";

import * as React from "react";
import NextLink from "next/link";
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Stack,
  useTheme,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { BottomNavProps } from "./interface";
import { SidebarMenuItem } from "@/Interfaces/Sidebar/menuItem";
import { isNavPathActive } from "@/utils/navUtils";
import { usePermissions } from "@/hooks/usePermissions/hook";

/* eslint-disable @typescript-eslint/no-explicit-any */

const MORE_VALUE = "mais";

interface SheetItemProps {
  item: SidebarMenuItem;
  active: boolean;
  renderIcon: (icon: React.ReactNode, active: boolean) => React.ReactNode;
  onNavigate: () => void;
}

function SheetItem({ item, active, renderIcon, onNavigate }: SheetItemProps) {
  return (
    <ListItemButton
      component={NextLink}
      href={item.path}
      onClick={onNavigate}
      selected={active}
      aria-current={active ? "page" : undefined}
      sx={{
        borderRadius: 2,
        mb: 0.5,
        "&.Mui-selected": {
          bgcolor: "sidebar.bgActive",
          "&:hover": { bgcolor: "sidebar.bgActiveHover" },
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40, "& svg": { width: 22, height: 22 } }}>
        {renderIcon(item.icon, active)}
      </ListItemIcon>
      <ListItemText
        primary={item.label}
        slotProps={{
          primary: {
            fontSize: 14,
            fontWeight: active ? 600 : 500,
            color: active ? "sidebar.textActive" : "sidebar.text",
          },
        }}
      />
    </ListItemButton>
  );
}

interface SheetActionProps {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  renderIcon: (icon: React.ReactNode, active: boolean) => React.ReactNode;
}

function SheetAction({ label, icon, onClick, renderIcon }: SheetActionProps) {
  return (
    <ListItemButton onClick={onClick} sx={{ borderRadius: 2, mb: 0.5 }}>
      {icon ? (
        <ListItemIcon sx={{ minWidth: 40, "& svg": { width: 22, height: 22 } }}>
          {renderIcon(icon, false)}
        </ListItemIcon>
      ) : null}
      <ListItemText
        primary={label}
        slotProps={{ primary: { fontSize: 14, fontWeight: 500, color: "sidebar.text" } }}
      />
    </ListItemButton>
  );
}

export function BottomNavComponent({
  primaryItems,
  moreItems,
  adminMenuItems = [],
  showAdminSection = false,
  user,
  onLogout,
  logoutIcon,
  activeUnit,
  onSwitchUnit,
  switchUnitIcon,
  activePath,
}: BottomNavProps) {
  const theme = useTheme();
  const sidebarColors = (theme.palette as any).sidebar;
  const { check, isLoading } = usePermissions();
  const [sheetOpen, setSheetOpen] = React.useState(false);

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

  // Mesma regra do <Can>: sem `permissions` o item é sempre visível; com
  // `permissions`, fica escondido enquanto a sessão carrega e depois segue a
  // checagem real — nunca vira um atalho fixo pra uma rota sem permissão.
  const filterVisible = React.useCallback(
    (items: SidebarMenuItem[]) =>
      items.filter((item) => {
        if (!item.permissions) return true;
        if (isLoading) return false;
        return check({ permissions: item.permissions });
      }),
    [check, isLoading]
  );

  const visiblePrimaryItems = React.useMemo(() => filterVisible(primaryItems), [filterVisible, primaryItems]);
  const visibleMoreItems = React.useMemo(() => filterVisible(moreItems), [filterVisible, moreItems]);
  const visibleAdminItems = React.useMemo(
    () => (showAdminSection ? filterVisible(adminMenuItems) : []),
    [filterVisible, adminMenuItems, showAdminSection]
  );

  const activePrimary = visiblePrimaryItems.find((item) => isNavPathActive(item.path, activePath));
  const isOnMoreRoute =
    !activePrimary &&
    (visibleMoreItems.some((item) => isNavPathActive(item.path, activePath)) ||
      visibleAdminItems.some((item) => isNavPathActive(item.path, activePath)));
  const navValue = activePrimary ? activePrimary.id : isOnMoreRoute ? MORE_VALUE : false;

  const closeSheet = () => setSheetOpen(false);

  return (
    <>
      <Box
        component="nav"
        role="navigation"
        aria-label="Menu principal"
        sx={{
          display: { xs: "flex", sm: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: (t) => t.zIndex.appBar,
          bgcolor: "sidebar.background",
          borderTop: 1,
          borderColor: "sidebar.divider",
          pb: "env(safe-area-inset-bottom)",
        }}
      >
        <BottomNavigation
          value={navValue}
          onChange={(_, newValue) => {
            if (newValue === MORE_VALUE) setSheetOpen(true);
          }}
          showLabels
          sx={{ width: "100%", height: 64, bgcolor: "transparent" }}
        >
          {visiblePrimaryItems.map((item) => {
            const active = isNavPathActive(item.path, activePath);
            return (
              <BottomNavigationAction
                key={item.id}
                component={NextLink}
                href={item.path}
                value={item.id}
                label={item.label}
                icon={renderIcon(item.icon, active)}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                sx={{
                  minWidth: 0,
                  px: 0.5,
                  color: "sidebar.text",
                  "&.Mui-selected": { color: "sidebar.textActive" },
                  "& .MuiBottomNavigationAction-label": {
                    fontSize: 11,
                    fontWeight: 500,
                    "&.Mui-selected": { fontSize: 11, fontWeight: 600 },
                  },
                }}
              />
            );
          })}

          <BottomNavigationAction
            value={MORE_VALUE}
            label="Mais"
            icon={<MoreHorizIcon />}
            aria-label="Mais opções"
            aria-haspopup="true"
            aria-expanded={sheetOpen}
            sx={{
              minWidth: 0,
              px: 0.5,
              color: "sidebar.text",
              "&.Mui-selected": { color: "sidebar.textActive" },
              "& .MuiBottomNavigationAction-label": {
                fontSize: 11,
                fontWeight: 500,
                "&.Mui-selected": { fontSize: 11, fontWeight: 600 },
              },
            }}
          />
        </BottomNavigation>
      </Box>

      <Drawer
        anchor="bottom"
        open={sheetOpen}
        onClose={closeSheet}
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: "80vh",
              pb: "env(safe-area-inset-bottom)",
            },
          },
        }}
      >
        <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 4,
              borderRadius: 2,
              bgcolor: "sidebar.divider",
              mx: "auto",
              mb: 1.5,
            }}
          />
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ width: 40, height: 40, bgcolor: "background.auth", flexShrink: 0 }}>
              {user.avatarInitial || user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Stack spacing={0} sx={{ minWidth: 0 }}>
              <Typography noWrap sx={{ fontSize: 14, fontWeight: 500, color: "sidebar.userNameColor" }}>
                {user.name}
              </Typography>
              <Typography noWrap sx={{ fontSize: 12, color: "sidebar.userEmailColor" }}>
                {user.email}
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "sidebar.divider" }} />

        <List sx={{ px: 1.5, py: 1, overflowY: "auto" }}>
          {visibleMoreItems.map((item) => (
            <SheetItem
              key={item.id}
              item={item}
              active={isNavPathActive(item.path, activePath)}
              renderIcon={renderIcon}
              onNavigate={closeSheet}
            />
          ))}

          {visibleAdminItems.length > 0 && (
            <>
              <Divider sx={{ my: 1, borderColor: "sidebar.divider" }} />
              <Typography
                variant="overline"
                sx={{ display: "block", px: 2, py: 0.5, fontSize: 12, color: "sidebar.section" }}
              >
                Administração
              </Typography>
              {visibleAdminItems.map((item) => (
                <SheetItem
                  key={item.id}
                  item={item}
                  active={isNavPathActive(item.path, activePath)}
                  renderIcon={renderIcon}
                  onNavigate={closeSheet}
                />
              ))}
            </>
          )}

          <Divider sx={{ my: 1, borderColor: "sidebar.divider" }} />

          {activeUnit && (
            <Box
              sx={{
                mx: 0.5,
                mb: 1,
                px: 1.5,
                py: 1,
                borderRadius: 2,
                bgcolor: "sidebar.bgActive",
              }}
            >
              <Typography
                variant="overline"
                sx={{ fontSize: 10, fontWeight: 500, color: "sidebar.section", letterSpacing: "0.08em" }}
              >
                Unidade
              </Typography>
              <Typography noWrap sx={{ fontSize: 14, fontWeight: 600, color: "sidebar.textActive" }}>
                {activeUnit.unidade}
              </Typography>
            </Box>
          )}

          {onSwitchUnit && (
            <SheetAction
              label="Trocar unidade"
              icon={switchUnitIcon}
              onClick={() => {
                closeSheet();
                onSwitchUnit();
              }}
              renderIcon={renderIcon}
            />
          )}

          <SheetAction
            label="Sair"
            icon={logoutIcon}
            onClick={() => {
              closeSheet();
              onLogout?.();
            }}
            renderIcon={renderIcon}
          />
        </List>
      </Drawer>
    </>
  );
}
