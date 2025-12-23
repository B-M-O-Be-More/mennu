"use client";

import { Box } from "@mui/material";
import { SidebarComponent } from "@/components/Sidebar";
import {
  DashboardIcon,
  CardapiosIcon,
  EstoqueIcon,
  RefeicoesIcon,
  SolicitacoesExtrasIcon,
  RelatoriosIcon,
  UsuariosIcon,
  TerminalIcon,
  PerfisPermissoesIcon,
  LogsAuditoriaIcon,
  ConfiguracoesIcon,
  SairIcon,
} from "@/components/Sidebar/icons";
import { usePathname } from "next/navigation";
import DashBoardPage from "@/components/DashboardPage";

export default function DashboardPage() {
  const pathname = usePathname();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      id: "cardapios",
      label: "Cardápios",
      icon: <CardapiosIcon />,
      path: "/cardapios",
    },
    {
      id: "estoque",
      label: "Estoque",
      icon: <EstoqueIcon />,
      path: "/estoque",
    },
    {
      id: "refeicoes",
      label: "Refeições",
      icon: <RefeicoesIcon />,
      path: "/refeicoes",
    },
    {
      id: "solicitacoes-extras",
      label: "Solicitações Extras",
      icon: <SolicitacoesExtrasIcon />,
      path: "/solicitacoes-extras",
    },
    {
      id: "relatorios",
      label: "Relatórios",
      icon: <RelatoriosIcon />,
      path: "/relatorios",
    },
    {
      id: "usuarios",
      label: "Usuários",
      icon: <UsuariosIcon />,
      path: "/usuarios",
    },
    {
      id: "terminal",
      label: "Terminal",
      icon: <TerminalIcon />,
      path: "/terminal",
    },
  ];

  const adminMenuItems = [
    {
      id: "perfis-permissoes",
      label: "Perfis & Permissões",
      icon: <PerfisPermissoesIcon />,
      path: "/admin/perfis-permissoes",
    },
    {
      id: "logs-auditoria",
      label: "Logs & Auditoria",
      icon: <LogsAuditoriaIcon />,
      path: "/admin/logs-auditoria",
    },
    {
      id: "configuracoes",
      label: "Configurações",
      icon: <ConfiguracoesIcon />,
      path: "/admin/configuracoes",
    },
  ];

  const user = {
    name: "Admin",
    email: "admin@mennu.io",
    avatarInitial: "A",
  };

  const handleLogout = () => {
    console.log("Logout clicked");
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
      <SidebarComponent
        menuItems={menuItems}
        adminMenuItems={adminMenuItems}
        user={user}
        onLogout={handleLogout}
        logoutIcon={<SairIcon />}
        showAdminSection={true}
        activePath={pathname}
      />
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#F9FAFB",
          padding: "24px",
          overflowY: "auto",
        }}
      >
        <DashBoardPage />
      </Box>
    </Box>
  );
}

