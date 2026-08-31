import { SidebarMenuItem } from "@/Interfaces/Sidebar/menuItem";
import { SidebarUser } from "@/Interfaces/Sidebar/user";
import { ReactNode } from "react";

/** Unidade em que a sessão está — o escopo de tudo que a tela mostra. */
export interface SidebarActiveUnit {
  unidade: string;
  empresa: string;
}

export interface SidebarProps {
  menuItems: SidebarMenuItem[];
  adminMenuItems?: SidebarMenuItem[];
  user: SidebarUser;
  onLogout?: () => void;
  logoutIcon?: ReactNode;
  /** Unidade ativa, exibida acima do perfil. Sem ela, o bloco não aparece. */
  activeUnit?: SidebarActiveUnit | null;
  /** Volta para a seleção de unidade sem encerrar a sessão. */
  onSwitchUnit?: () => void;
  switchUnitIcon?: ReactNode;
  showAdminSection?: boolean;
  activePath?: string;
  logoSrc?: string;
}

