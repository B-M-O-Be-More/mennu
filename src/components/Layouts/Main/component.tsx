"use client";

import React from "react";
import { Box } from "@mui/material";
import { SidebarComponent } from "@/components/Sidebar";
import { BottomNavComponent } from "@/components/BottomNav";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/AuthContext";
import { BuildingIcon, CardapiosIcon, ConfiguracoesIcon, DashboardIcon, EstoqueIcon, LogsAuditoriaIcon, PerfisPermissoesIcon, RefeicoesIcon, RelatoriosIcon, SairIcon, SolicitacoesExtrasIcon, TerminalIcon, UsuariosIcon } from "@/components/Icons";
import { hasAdminAccess } from "@/utils/userUtils";
import { viewPermission } from "@/utils/permissionUtils";
import { SELECT_UNIT_ROUTE } from "@/utils/userContextUtils";
import { SidebarMenuItem } from "@/Interfaces/Sidebar/menuItem";
import {
  DEFAULT_SYSTEM_LOGO_SRC,
  GENERAL_SETTINGS_LOGO_UPDATED_EVENT,
  GeneralSettingsLogoUpdatedDetail,
  getGeneralSettingsLogoSrc,
  settingsService,
} from "@/services/settingsService";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isAuthenticated,
    logout,
    isLoadingPages,
    user,
    activeContext,
    clearContext,
  } = useUser();
  const router = useRouter();
  const [sidebarLogoSrc, setSidebarLogoSrc] = React.useState(
    DEFAULT_SYSTEM_LOGO_SRC,
  );

  const pathname = usePathname();
  const previousPathnameRef = React.useRef<string | null>(null);

  // `permissions` é o que o <Can> dentro da sidebar checa para exibir o item:
  // `viewPermission("cardapio")` → `cardapio.view.*`, que casa com
  // `cardapio.view.list`/`cardapio.view.item`. O recurso é o nome usado pela
  // API no código de permissão (singular), não o rótulo da tela.
  const menuItems: SidebarMenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard", permissions: viewPermission("dashboard") },
    { id: "cardapios", label: "Cardápios", icon: <CardapiosIcon />, path: "/cardapios", permissions: viewPermission("cardapio") },
    { id: "estoque", label: "Estoque", icon: <EstoqueIcon />, path: "/estoque", permissions: viewPermission("estoque") },
    { id: "refeicoes", label: "Refeições", icon: <RefeicoesIcon />, path: "/refeicoes", permissions: viewPermission("refeicaoservida") },
    // TODO: a API ainda não expõe um recurso para solicitações extras — sem
    // `permissions`, o item fica visível para todos.
    { id: "solicitacoes-extras", label: "Solicitações Extras", icon: <SolicitacoesExtrasIcon />, path: "/solicitacoes-extras" },
    { id: "relatorios", label: "Relatórios", icon: <RelatoriosIcon />, path: "/relatorios", permissions: viewPermission("relatorio") },
    { id: "usuarios", label: "Usuários", icon: <UsuariosIcon />, path: "/usuarios", permissions: viewPermission("usuario") },
    { id: "terminal", label: "Terminal", icon: <TerminalIcon />, path: "/terminal", permissions: viewPermission("terminal") },
  ];

  const adminMenuItems: SidebarMenuItem[] = [
    { id: "perfis-permissoes", label: "Perfis & Permissões", icon: <PerfisPermissoesIcon />, path: "/admin/perfis-permissoes", permissions: viewPermission("cargo") },
    { id: "logs-auditoria", label: "Logs & Auditoria", icon: <LogsAuditoriaIcon />, path: "/admin/logs-auditoria", permissions: viewPermission("log") },
    { id: "configuracoes", label: "Configurações", icon: <ConfiguracoesIcon />, path: "/admin/configuracoes", permissions: viewPermission("configuracao") },
  ];

  // Na BottomNav do celular só cabem 5 botões — 4 seções fixas + "Mais" com o
  // resto (inclui a seção Admin). As mais usadas no dia a dia ficam fixas.
  const MOBILE_PRIMARY_IDS = ["dashboard", "cardapios", "estoque", "refeicoes"];
  const mobilePrimaryItems = menuItems.filter((item) => MOBILE_PRIMARY_IDS.includes(item.id));
  const mobileMoreItems = menuItems.filter((item) => !MOBILE_PRIMARY_IDS.includes(item.id));

  // A seleção de unidade também exige sessão: entra na lista para herdar o
  // redirect de não autenticado.
  const protectedRoutes = [
    ...[...menuItems, ...adminMenuItems].map((item) => item.path),
    SELECT_UNIT_ROUTE,
  ];
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
  const isContextRoute = pathname === SELECT_UNIT_ROUTE;

  React.useEffect(() => {
    // Sem unidade ativa não existe escopo: as telas mostrariam dados de lugar
    // nenhum e os requests sairiam sem o header `unidade-id-x`. O usuário volta
    // para a seleção — inclusive quando a unidade guardada deixou de valer.
    if (isLoadingPages) return;
    if (!isAuthenticated) return;
    if (!isKnownProtectedRoute) return;
    if (isContextRoute) return;
    if (activeContext) return;

    router.replace(SELECT_UNIT_ROUTE);
  }, [
    isLoadingPages,
    isAuthenticated,
    isKnownProtectedRoute,
    isContextRoute,
    activeContext,
    router,
  ]);

  const shouldShowSidebar =
    isAuthenticated &&
    isKnownProtectedRoute &&
    !isKioskRoute &&
    !isContextRoute &&
    Boolean(activeContext);

  React.useEffect(() => {
    let active = true;

    // Evita exibir por alguns instantes a marca da empresa anterior.
    setSidebarLogoSrc(DEFAULT_SYSTEM_LOGO_SRC);

    if (!shouldShowSidebar || !activeContext?.empresa_id) {
      return () => {
        active = false;
      };
    }

    settingsService
      .getGeneral()
      .then((settings) => {
        if (active) setSidebarLogoSrc(getGeneralSettingsLogoSrc(settings));
      })
      .catch(() => {
        if (active) setSidebarLogoSrc(DEFAULT_SYSTEM_LOGO_SRC);
      });

    return () => {
      active = false;
    };
  }, [shouldShowSidebar, activeContext?.empresa_id]);

  React.useEffect(() => {
    const handleLogoUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<GeneralSettingsLogoUpdatedDetail>;
      setSidebarLogoSrc(
        customEvent.detail?.logoSrc || DEFAULT_SYSTEM_LOGO_SRC,
      );
    };

    window.addEventListener(
      GENERAL_SETTINGS_LOGO_UPDATED_EVENT,
      handleLogoUpdated,
    );
    return () => {
      window.removeEventListener(
        GENERAL_SETTINGS_LOGO_UPDATED_EVENT,
        handleLogoUpdated,
      );
    };
  }, []);

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
    !isLoadingPages &&
    isKnownProtectedRoute &&
    (!isAuthenticated || (!isContextRoute && !activeContext));

  const sidebarUser = {
    name: user?.nome || "Usuário",
    email: user?.email || "",
    avatarInitial: user?.nome?.charAt(0)?.toUpperCase() || "U",
  };

  const activeUnit = activeContext
    ? {
        unidade: activeContext.unidade_nome,
        empresa: activeContext.empresa_nome,
      }
    : null;

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
          menuItems={menuItems}
          adminMenuItems={adminMenuItems}
          user={sidebarUser}
          onLogout={logout}
          logoutIcon={<SairIcon />}
          activeUnit={activeUnit}
          onSwitchUnit={clearContext}
          switchUnitIcon={<BuildingIcon />}
          showAdminSection={hasAdminAccess(user)}
          logoSrc={sidebarLogoSrc}
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
          // Espaço extra embaixo no celular pra BottomNav fixa não cobrir o
          // fim do conteúdo.
          pb: shouldShowSidebar
            ? { xs: "calc(64px + env(safe-area-inset-bottom) + 12px)", sm: 2, md: 2.5, lg: 3 }
            : 0,
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

      {shouldShowSidebar && (
        <BottomNavComponent
          primaryItems={mobilePrimaryItems}
          moreItems={mobileMoreItems}
          adminMenuItems={adminMenuItems}
          showAdminSection={hasAdminAccess(user)}
          user={sidebarUser}
          onLogout={logout}
          logoutIcon={<SairIcon />}
          activeUnit={activeUnit}
          onSwitchUnit={clearContext}
          switchUnitIcon={<BuildingIcon />}
          activePath={pathname}
        />
      )}
    </Box>
  );
}
