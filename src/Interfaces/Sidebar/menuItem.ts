export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  onClick?: () => void;
}