import { ReactNode } from "react";

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
  onClick?: () => void;
}

export interface SidebarUser {
  name: string;
  email: string;
  avatar?: string;
  avatarInitial?: string;
}

export interface SidebarProps {
  menuItems: SidebarMenuItem[];
  adminMenuItems?: SidebarMenuItem[];
  user: SidebarUser;
  onLogout?: () => void;
  logoutIcon?: ReactNode;
  showAdminSection?: boolean;
  activePath?: string;
}

