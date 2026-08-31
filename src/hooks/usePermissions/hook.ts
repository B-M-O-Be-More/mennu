"use client";

import React from "react";
import { useUser } from "@/context/AuthContext";
import {
  checkAccess,
  getUserFeatureFlags,
  getUserPermissions,
  hasFeature as hasFeatureFor,
  hasFullAccess as hasFullAccessFor,
  hasLevel as hasLevelFor,
  hasModulePermission,
  hasPermission,
} from "@/utils/permissionUtils";
import { UsePermissionsReturn } from "./interface";

/**
 * API imperativa de permissões — para desabilitar botões, montar menus,
 * decidir redirects, etc. Para esconder/mostrar JSX prefira `<Can />`.
 *
 * Tudo é relativo à unidade ativa da sessão: sem unidade escolhida o usuário
 * não tem permissão alguma, e trocar de unidade muda as respostas.
 *
 * ```tsx
 * const { can, canModule } = usePermissions();
 * <Button disabled={!can("estoque.create.item")}>Novo insumo</Button>
 * ```
 */
export function usePermissions(): UsePermissionsReturn {
  const { user, isLoadingPages } = useUser();

  const permissions = React.useMemo(() => getUserPermissions(user), [user]);
  const features = React.useMemo(() => getUserFeatureFlags(user), [user]);

  return React.useMemo(
    () => ({
      user,
      permissions,
      features,
      level: user?.tipo_usuario,
      isLoading: isLoadingPages,
      hasFullAccess: hasFullAccessFor(user),
      can: (permissions, mode) => hasPermission(user, permissions, mode),
      canAny: (codes) => hasPermission(user, codes, "any"),
      canAll: (codes) => hasPermission(user, codes, "all"),
      canModule: (module, action) => hasModulePermission(user, module, action),
      hasFeature: (feature, mode) => hasFeatureFor(user, feature, mode),
      hasLevel: (level) => hasLevelFor(user, level),
      check: (criteria) => checkAccess(user, criteria),
    }),
    [user, permissions, features, isLoadingPages],
  );
}

export default usePermissions;
