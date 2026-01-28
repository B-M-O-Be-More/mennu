import { SidebarMenuItem } from "@/Interfaces/Sidebar/menuItem";
import { SidebarUser } from "@/Interfaces/Sidebar/user";
import { ReactNode } from "react";

export interface SidebarProps {
  menuItems: SidebarMenuItem[];
  adminMenuItems?: SidebarMenuItem[];
  user: SidebarUser;
  onLogout?: () => void;
  logoutIcon?: ReactNode;
  showAdminSection?: boolean;
  activePath?: string;
}

