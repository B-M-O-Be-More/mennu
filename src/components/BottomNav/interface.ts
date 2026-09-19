import { ReactNode } from "react";
import { SidebarMenuItem } from "@/Interfaces/Sidebar/menuItem";
import { SidebarUser } from "@/Interfaces/Sidebar/user";
import { SidebarActiveUnit } from "@/components/Sidebar/interface";

export interface BottomNavProps {
  /** No máximo 4 — o 5º slot da barra é sempre o botão "Mais". */
  primaryItems: SidebarMenuItem[];
  /** Itens de topo que não couberam na barra, exibidos na folha "Mais". */
  moreItems: SidebarMenuItem[];
  adminMenuItems?: SidebarMenuItem[];
  showAdminSection?: boolean;
  user: SidebarUser;
  onLogout?: () => void;
  logoutIcon?: ReactNode;
  /** Unidade ativa, exibida no topo da folha "Mais". */
  activeUnit?: SidebarActiveUnit | null;
  /** Volta para a seleção de unidade sem encerrar a sessão. */
  onSwitchUnit?: () => void;
  switchUnitIcon?: ReactNode;
  activePath?: string;
}
