/**
 * Mesmo critério usado pela Sidebar e pela BottomNav para destacar o item
 * ativo: rota exata, ou sub-rota (exceto `/dashboard`, que senão "vazaria"
 * como ativo para qualquer rota por causa do `startsWith`).
 */
export function isNavPathActive(itemPath: string, activePath?: string): boolean {
  if (!activePath) return false;
  if (activePath === itemPath) return true;
  if (itemPath !== "/dashboard" && activePath.startsWith(`${itemPath}/`)) return true;
  return false;
}
