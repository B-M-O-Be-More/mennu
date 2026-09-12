"use client";

import React from "react";
import { useUser } from "@/context/AuthContext";
import { usePermissions } from "@/hooks/usePermissions/hook";
import { AuditFlow, hasAuditFlowRole } from "@/utils/auditFlowUtils";

/**
 * Qual fluxo da auditoria de estoque o usuário enxerga, a partir do cargo no
 * contexto ativo. Quem acumula os dois cargos — ou tem acesso total — escolhe
 * pelo seletor da tela; os demais entram direto no fluxo do próprio cargo.
 */
export function useAuditFlow() {
  const { activeContext } = useUser();
  const { hasFullAccess, level, isLoading } = usePermissions();

  const isAuditor = hasAuditFlowRole(activeContext, "auditor");
  const isNutricionista = hasAuditFlowRole(activeContext, "nutricionista");
  const isAdmin = hasFullAccess || level === "admin";

  const canChooseFlow = isAdmin || (isAuditor && isNutricionista);
  // Sem escolha, o cargo decide: só o auditor cai no fluxo de campo.
  const defaultFlow: AuditFlow =
    !canChooseFlow && isAuditor ? "auditor" : "nutricionista";

  const [flow, setFlow] = React.useState<AuditFlow>(defaultFlow);

  // Os contextos chegam depois do primeiro render (e mudam ao trocar de
  // unidade), então o fluxo padrão precisa ser reaplicado quando resolve.
  React.useEffect(() => {
    setFlow(defaultFlow);
  }, [defaultFlow]);

  return {
    flow,
    setFlow,
    canChooseFlow,
    isAdmin,
    isAuditor,
    isNutricionista,
    isLoadingFlow: isLoading,
  };
}

export default useAuditFlow;
