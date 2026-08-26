"use client";

import React from "react";
import { Alert } from "@mui/material";
import { usePermissions } from "@/hooks/usePermissions/hook";
import { CanProps } from "./interface";

/**
 * Renderiza `children` somente se o usuário logado tiver **todas** as
 * permissões informadas — faltando uma, nada é renderizado.
 *
 * ```tsx
 * // só renderiza se o usuário tiver as duas permissões
 * <Can permissions={["auditoriaestoque.create.item", "auditoriaestoque.delete.item"]}>
 *   <AuditActions />
 * </Can>
 *
 * <Can permissions="cardapio.create.item">
 *   <Button>Novo cardápio</Button>
 * </Can>
 *
 * // basta uma delas
 * <Can permissions={["relatorio.export.csv", "relatorio.export.pdf"]} mode="any">
 *   <ExportMenu />
 * </Can>
 *
 * // curinga: qualquer permissão do recurso / de uma ação
 * <Can permissions="estoque.*"><StockPage /></Can>
 * <Can module="estoque" action="edit" message="Você não pode editar o estoque.">
 *   <StockForm />
 * </Can>
 *
 * <Can level="admin" fallback={<EmptyState />}>
 *   <AuditPanel />
 * </Can>
 * ```
 *
 * Nega por padrão: enquanto `/auth/ativo` não resolve, nada é renderizado
 * (evita piscar conteúdo restrito). `acesso_total` libera as checagens de
 * permissão. A validação real continua no backend.
 */
export default function Can({
  children,
  message,
  fallback,
  loadingFallback = null,
  ...criteria
}: CanProps) {
  const { check, isLoading } = usePermissions();

  if (isLoading) return <React.Fragment>{loadingFallback}</React.Fragment>;

  if (check(criteria)) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  if (fallback !== undefined) return <React.Fragment>{fallback}</React.Fragment>;

  if (message) {
    return (
      <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
        {message}
      </Alert>
    );
  }

  return null;
}
