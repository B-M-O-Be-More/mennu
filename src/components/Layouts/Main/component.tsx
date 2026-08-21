"use client";

import React from "react";
import { Box } from "@mui/material";
import { SidebarComponent } from "@/components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/AuthContext";
import { CardapiosIcon, ConfiguracoesIcon, DashboardIcon, EstoqueIcon, LogsAuditoriaIcon, PerfisPermissoesIcon, RefeicoesIcon, RelatoriosIcon, SairIcon, SolicitacoesExtrasIcon, TerminalIcon, UsuariosIcon } from "@/components/Icons";
import { hasAdminAccess, hasModulePermission } from "@/utils/userUtils";

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

  const visibleMenuItems = menuItems.filter(
    (item) => item.id !== "terminal" || hasModulePermission(user, "Terminal"),
  );

  const protectedRoutes = [...menuItems, ...adminMenuItems].map((item) => item.path);
  const isKnownProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  React.useEffect(() => {
    // Não carimba previousPathnameRef enquanto isLoadingPages ainda não
    // resolveu — senão, quando o loading termina e descobre que o usuário
    // não está autenticado, o pathname "já mudou" nesse ref (foi carimbado
    // no render anterior, ainda em loading) e o redirect nunca dispara.
    if (isLoadingPages) return;

    const previousPathname = previousPathnameRef.current;
    const hasPathChanged = previousPathname === null || previousPathname !== pathname;
    previousPathnameRef.current = pathname;

    if (isAuthenticated) return;
    if (!isKnownProtectedRoute) return;
    if (!hasPathChanged) return;

    const params = new URLSearchParams({
      authError: "unauthorized",
      from: pathname,
    });

    router.replace(`/?${params.toString()}`);
  }, [isLoadingPages, isAuthenticated, isKnownProtectedRoute, pathname, router]);

  const isKioskRoute = pathname.startsWith("/terminal/");
  const shouldShowSidebar = isAuthenticated && isKnownProtectedRoute && !isKioskRoute;

  React.useEffect(() => {
    // Sai da tela cheia sempre que a rota atual não for mais kiosk — cobre
    // o botão de voltar, o botão nativo do navegador, qualquer navegação.
    // Não depende de mount/unmount do componente do kiosk (isso rodava em
    // duplicidade no Strict Mode do dev e fazia a tela cheia entrar e sair
    // na hora).
    if (!isKioskRoute && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, [isKioskRoute]);
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
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      {shouldShowSidebar && (
        <SidebarComponent
          menuItems={visibleMenuItems}
          adminMenuItems={adminMenuItems}
          user={sidebarUser}
          onLogout={logout}
          logoutIcon={<SairIcon />}
          showAdminSection={hasAdminAccess(user)}
          logoSrc="/assets/logo.svg"
          activePath={pathname}
        />
      )}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100%",
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
