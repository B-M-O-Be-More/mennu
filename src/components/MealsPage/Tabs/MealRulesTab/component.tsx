"use client";

import Card from "@/components/Cards/Card";
import EmptyState from "@/components/EmptyState";
import { useUser } from "@/context/AuthContext";
import { MealRuleResponse } from "@/Interfaces/Meals/MealTypes";
import { UnitPolicyConfigApi } from "@/Interfaces/Settings/settings";
import { MealRuleInput } from "@/schemas/mealRulesSchema";
import { settingsService } from "@/services/settingsService";
import {
  applyMealRuleToPolicies,
  mapPoliciesToMealRules,
} from "@/utils/mealRulesUtils";
import { Alert, Box, Skeleton, Stack, Typography } from "@mui/material";
import React from "react";
import MealRulesCard from "../../../Cards/MealRulesCard";
import { MealRulesTabProps } from "./interface";

export function MealRulesTab({ refreshKey = 0, onNotify }: MealRulesTabProps) {
  const { activeContext } = useUser();
  const unitId = activeContext?.unidade_id;
  const unitName = activeContext?.unidade_nome ?? "Unidade";

  const [config, setConfig] = React.useState<UnitPolicyConfigApi | null>(null);
  const [isLoading, setIsLoading] = React.useState(Boolean(unitId));
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!unitId) {
      setConfig(null);
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);
    setError(null);

    settingsService
      .getUnitPolicies(unitId)
      .then((policies) => {
        if (active) setConfig(policies);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Erro ao carregar as regras de consumo",
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey, unitId]);

  const rules = React.useMemo(
    () => (config ? mapPoliciesToMealRules(config, unitName) : []),
    [config, unitName],
  );

  const handleSaveRule = React.useCallback(
    async (rule: MealRuleResponse, values: MealRuleInput) => {
      if (!unitId || !config) return;

      const payload = applyMealRuleToPolicies(config, rule.mealType, values);
      const updated = await settingsService.updateUnitPolicies(unitId, payload);

      // A API pode responder só com uma mensagem; nesse caso vale o merge local.
      setConfig(updated?.politicas ? updated : payload);
      onNotify?.(`Regras de ${rule.mealTypeLabel} atualizadas`, "success");
    },
    [config, onNotify, unitId],
  );

  return (
    <Card>
      <Box component="span">
        <Typography color="text.primary">
          Regras de Consumo por Unidade
        </Typography>
        <Typography variant="body2" fontWeight={400} color="text.secondary">
          Estas regras são herdadas automaticamente pelos terminais
        </Typography>
      </Box>

      {!unitId && (
        <Alert severity="warning">
          Selecione uma unidade para visualizar as regras de consumo.
        </Alert>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {isLoading ? (
        <Stack direction={"row"} flexWrap="wrap" gap={2}>
          {[0, 1].map((key) => (
            <Skeleton
              key={key}
              variant="rounded"
              height={260}
              sx={{ minWidth: { xs: "100%", md: "49%" } }}
            />
          ))}
        </Stack>
      ) : rules.length === 0 ? (
        <EmptyState />
      ) : (
        <Stack direction={"row"} flexWrap="wrap" gap={2}>
          {rules.map((rule) => (
            <MealRulesCard key={rule.id} rule={rule} onSave={handleSaveRule} />
          ))}
        </Stack>
      )}
    </Card>
  );
}
