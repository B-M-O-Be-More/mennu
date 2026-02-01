"use client";

import { Box } from "@mui/material";
import { SidebarComponent } from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/AuthContext";
import { CardapiosIcon, ConfiguracoesIcon, DashboardIcon, EstoqueIcon, LogsAuditoriaIcon, PerfisPermissoesIcon, RefeicoesIcon, RelatoriosIcon, SairIcon, SolicitacoesExtrasIcon, TerminalIcon, UsuariosIcon } from "@/components/Icons";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useUser();

  const pathname = usePathname();

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

  const user = {
    name: "Admin",
    email: "admin@mennu.io",
    avatarInitial: "A",
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {isAuthenticated && (
        <SidebarComponent
          menuItems={menuItems}
          adminMenuItems={adminMenuItems}
          user={user}
          onLogout={() => console.log("logout")}
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
          p: isAuthenticated ? 3 : 0,
          backgroundColor: (theme) => theme.palette.background.default,

          "&::-webkit-scrollbar": {
            width: 0,
            height: 0,
          },

          scrollbarWidth: "none",
        }}
      >
        {children}
      </Box>

    </Box>
  );
}
