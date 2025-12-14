"use client";

import { SidebarComponent } from "./component";
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
} from "./icons";

// Exemplo de uso básico
export function SidebarExample() {
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
    // Implementar lógica de logout aqui
  };

  return (
    <SidebarComponent
      menuItems={menuItems}
      adminMenuItems={adminMenuItems}
      user={user}
      onLogout={handleLogout}
      logoutIcon={<SairIcon />}
      showAdminSection={true} // Renderiza a seção de administração
      activePath="/dashboard" // Define qual item está ativo
    />
  );
}

