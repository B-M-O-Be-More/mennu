"use client";

import React from "react";
import { Box } from "@mui/material";
import { SidebarComponent } from "@/components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/AuthContext";
import { CardapiosIcon, ConfiguracoesIcon, DashboardIcon, EstoqueIcon, LogsAuditoriaIcon, PerfisPermissoesIcon, RefeicoesIcon, RelatoriosIcon, SairIcon, SolicitacoesExtrasIcon, TerminalIcon, UsuariosIcon } from "@/components/Icons";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, logout, isLoadingPages, user } = useUser();
  const router = useRouter();

  const pathname = usePathname();
  const previousPathnameRef = React.useRef<string | null>(null);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { id: "cardapios", label: "Cardápios", icon: <CardapiosIcon />, path: "/cardapios" },
    { id: "estoque", label: "Estoque", icon: <EstoqueIcon />, path: "/estoque" },
    { id: "refeicoes", label: "Refeições", icon: <RefeicoesIcon />, path: "/refeicoes" },
    { id: "solicitacoes-extras", label: "Solicitações Extras", icon: <SolicitacoesExtrasIcon />, path: "/solicitacoes-extras" },
    { id: "relatorios", label: "Relatórios", icon: <RelatoriosIcon />, path: "/relatorios" },
    { id: "usuarios", label: "Usuários", icon: <UsuariosIcon />, path: "/usuarios" },
    { id: "terminal", label: "Terminal", icon: <TerminalIcon />, path: "/terminal" },
  ];

  const adminMenuItems = [
    { id: "perfis-permissoes", label: "Perfis & Permissões", icon: <PerfisPermissoesIcon />, path: "/admin/perfis-permissoes" },
    { id: "logs-auditoria", label: "Logs & Auditoria", icon: <LogsAuditoriaIcon />, path: "/admin/logs-auditoria" },
    { id: "configuracoes", label: "Configurações", icon: <ConfiguracoesIcon />, path: "/admin/configuracoes" },
  ];

  const protectedRoutes = [...menuItems, ...adminMenuItems].map((item) => item.path);
  const isKnownProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  React.useEffect(() => {
    const previousPathname = previousPathnameRef.current;
    const isFirstRender = previousPathname === null;
    const hasPathChanged = isFirstRender || previousPathname !== pathname;

    previousPathnameRef.current = pathname;

    if (isLoadingPages) return;
    if (isAuthenticated) return;
    if (!isKnownProtectedRoute) return;
    if (!hasPathChanged) return;

    const params = new URLSearchParams({
      authError: "unauthorized",
      from: pathname,
    });

    router.replace(`/?${params.toString()}`);
  }, [isLoadingPages, isAuthenticated, isKnownProtectedRoute, pathname, router]);

  const shouldShowSidebar = isAuthenticated && isKnownProtectedRoute;
  const shouldBlockProtectedContent =
    !isLoadingPages && !isAuthenticated && isKnownProtectedRoute;

  const sidebarUser = {
    name: user?.nome || "Usuário",
    email: user?.email || "",
    avatarInitial: user?.nome?.charAt(0)?.toUpperCase() || "U",
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100dvh",
        overflow: "hidden",
      }}
    >
      {shouldShowSidebar && (
        <SidebarComponent
          menuItems={menuItems}
          adminMenuItems={adminMenuItems}
          user={sidebarUser}
          onLogout={logout}
          logoutIcon={<SairIcon />}
          showAdminSection
          activePath={pathname}
        />
      )}
      <Box
        component="main"
        sx={{
          flex: 1,
          overflowY: "auto",
          p: shouldShowSidebar ? { xs: 1.5, sm: 2, md: 2.5, lg: 3 } : 0,
          backgroundColor: (theme) => theme.palette.background.default,

          "&::-webkit-scrollbar": {
            width: 0,
            height: 0,
          },

          scrollbarWidth: "none",
        }}
      >
        {!shouldBlockProtectedContent && children}
      </Box>

    </Box>
  );
}
