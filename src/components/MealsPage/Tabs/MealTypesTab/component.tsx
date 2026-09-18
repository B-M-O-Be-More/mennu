"use client";

import Card from "@/components/Cards/Card";
import EmptyState from "@/components/EmptyState";
import {
  MealTypeResponse,
  TipoRefeicaoApi,
  ValidationProps,
} from "@/Interfaces/Meals/MealTypes";
import { MealTypesTabProps } from "./interface";
import MealTypeCard from "../../../Cards/MealTypeCard";
import { Alert, Stack, Typography } from "@mui/material";
import { mealValidations } from "@/data/meals";
import React from "react";
import { mealTypeService } from "@/services/mealTypeService";

function getValidationById(id: string): ValidationProps | undefined {
  return mealValidations.find((validation) => validation.id === id);
}

function mapApiMealTypeToUi(mealType: TipoRefeicaoApi): MealTypeResponse {
  const validations: ValidationProps[] = [];

  if (mealType.exige_pesagem) {
    const pesagemValidation = getValidationById("pesagem");
    if (pesagemValidation) validations.push(pesagemValidation);
  }

  if (mealType.leitura_cartao) {
    const cartaoValidation = getValidationById("cartao");
    if (cartaoValidation) validations.push(cartaoValidation);
  }

  if (mealType.confirmacao_manual) {
    const extraValidation = getValidationById("extra");
    if (extraValidation) validations.push(extraValidation);
  }

  const units = [{ id: String(mealType.unidade.id), label: mealType.unidade.nome }];

  const startTime = mealType.horario_inicio
    ? `1970-01-01T${mealType.horario_inicio}`
    : undefined;
  const endTime = mealType.horario_fim
    ? `1970-01-01T${mealType.horario_fim}`
    : undefined;

  return {
    id: String(mealType.id),
    typeName: mealType.nome,
    description: mealType.unidade?.nome
      ? `Disponível na unidade ${mealType.unidade.nome}`
      : "Sem descrição",
    startTime,
    endTime,
    status: mealType.ativo,
    validations,
    units,
  };
}

export function MealTypesTab({ refreshKey = 0, onNotify }: MealTypesTabProps) {
  const [mealTypes, setMealTypes] = React.useState<MealTypeResponse[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadMealTypes = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setMealTypes((await mealTypeService.listMealTypes()).map(mapApiMealTypeToUi));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao carregar tipos de refeição",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadMealTypes();
  }, [loadMealTypes, refreshKey]);

  return (
    <Card>
      <Typography>Tipos de Refeição Cadastrados</Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {isLoading ? (
        <Typography color="text.secondary">Carregando tipos de refeição...</Typography>
      ) : mealTypes.length === 0 ? (
        <EmptyState />
      ) : (
        <Stack direction={"row"} flexWrap="wrap" gap={1}>
          {mealTypes.map((type) => (
            <MealTypeCard
              key={type.id}
              type={type}
              onUpdated={loadMealTypes}
              onNotify={onNotify}
            />
          ))}
        </Stack>
      )}
    </Card>
  );
}
