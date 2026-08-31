import { PermissionCode } from "@/Interfaces/ProfilePermissions/profilePermissions";

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  onClick?: () => void;
  /**
   * Permissão(ões) exigida(s) para o item aparecer. Sem isso, o item é
   * sempre visível. Use `viewPermission("cardapio")` → `cardapio.view.*`.
   */
  permissions?: PermissionCode | PermissionCode[];
}
