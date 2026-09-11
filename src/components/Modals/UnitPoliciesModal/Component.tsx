"use client";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import ClosableAlertBox from "@/components/ClosableAlertBox";
import Toast from "@/components/Toast";
import { IUserContext } from "@/Interfaces/User/context";
import { UnitPolicyConfigApi, UnitPoliciesFormValues } from "@/Interfaces/Settings/settings";
import { useToast } from "@/hooks/useToast/hook";
import { createPolicySchema } from "@/schemas/unitSchema";
import { authContextService } from "@/services/authContextService";
import { mealTypeService } from "@/services/mealTypeService";
import { settingsService } from "@/services/settingsService";
import { inputTimeToApi } from "@/utils/timeRangeAdapter";
import {
  getMealTimeSnapshot,
  mergeDynamicUnitPolicies,
  toUnitPoliciesForm,
} from "@/utils/unitPoliciesUtils";
import Modal from "../Modal";
import { UnitPoliciesModalProps } from ".";
import ConsumptionLimitsSection from "./ConsumptionLimitsSection";
import MealScheduleSection from "./MealScheduleSection";

const EMPTY_FORM: UnitPoliciesFormValues = {
  tiposRefeicao: [],
  limites: { diario: 0, semanal: 0, mensal: 0 },
};

export default function UnitPoliciesModal({
  open,
  onClose,
  unitItem,
  onSaved,
}: UnitPoliciesModalProps) {
  const { toast, showToast, closeToast } = useToast();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UnitPoliciesFormValues>({
    resolver: yupResolver(createPolicySchema),
    defaultValues: EMPTY_FORM,
  });
  const { fields, append } = useFieldArray({ control, name: "tiposRefeicao" });
  const [currentPolicies, setCurrentPolicies] = React.useState<UnitPolicyConfigApi>({});
  const [requestContext, setRequestContext] = React.useState<IUserContext | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const mealTimeSnapshot = React.useRef(
    new Map<number, { horarioInicio: string; horarioFim: string }>(),
  );
  const loadRequest = React.useRef(0);

  const loadData = React.useCallback(async (unitId: number, clearError = true) => {
    const requestId = ++loadRequest.current;
    setIsLoading(true);
    setRequestContext(null);
    if (clearError) setError(null);

    try {
      const context = await authContextService.getContextForUnit(unitId);
      const [policies, allMealTypes] = await Promise.all([
        settingsService.getUnitPolicies(unitId, context),
        mealTypeService.listMealTypes(200, context),
      ]);
      if (requestId !== loadRequest.current) return;

      const unitMealTypes = allMealTypes
        .filter((mealType) => Number(mealType.unidade?.id) === unitId)
        .sort((left, right) => left.ordem - right.ordem);

      setCurrentPolicies(policies);
      setRequestContext(context);
      mealTimeSnapshot.current = getMealTimeSnapshot(unitMealTypes);
      reset(toUnitPoliciesForm(policies, unitMealTypes));
    } catch (loadError) {
      if (requestId === loadRequest.current) {
        setError(loadError instanceof Error ? loadError.message : "Erro ao carregar políticas");
      }
    } finally {
      if (requestId === loadRequest.current) setIsLoading(false);
    }
  }, [reset]);

  React.useEffect(() => {
    if (!open || !unitItem) return;
    void loadData(unitItem.id);

    return () => {
      loadRequest.current += 1;
    };
  }, [loadData, open, unitItem]);

  const handleClose = () => {
    if (isSaving) return;
    loadRequest.current += 1;
    setError(null);
    setRequestContext(null);
    reset(EMPTY_FORM);
    onClose();
  };

  const handleAddMeal = () => {
    const nextOrder = fields.reduce((highest, meal) => Math.max(highest, meal.ordem), -1) + 1;
    append({
      tipoRefeicaoId: null,
      nome: "",
      horarioInicio: "",
      horarioFim: "",
      ordem: nextOrder,
      isNew: true,
    });
  };

  const reconcileAfterFailure = async (unitId: number, message: string) => {
    await loadData(unitId, false);
    setError(message);
  };

  const onSubmit = async (data: UnitPoliciesFormValues) => {
    if (!unitItem) return;
    setError(null);
    setIsSaving(true);

    try {
      if (!requestContext || requestContext.unidade_id !== unitItem.id) {
        throw new Error("O contexto desta unidade precisa ser recarregado antes de salvar.");
      }

      const newMeals = data.tiposRefeicao.filter((meal) => meal.isNew);
      for (const meal of newMeals) {
        await mealTypeService.createMealType({
          nome: meal.nome.trim(),
          unidade_id: unitItem.id,
          horario_inicio: inputTimeToApi(meal.horarioInicio),
          horario_fim: inputTimeToApi(meal.horarioFim),
          ordem: meal.ordem,
          exige_pesagem: false,
          leitura_cartao: false,
          confirmacao_manual: false,
        }, requestContext);
      }

      const changedMeals = data.tiposRefeicao.filter((meal) => {
        if (meal.isNew || meal.tipoRefeicaoId === null) return false;
        const initial = mealTimeSnapshot.current.get(meal.tipoRefeicaoId);
        return initial?.horarioInicio !== meal.horarioInicio
          || initial?.horarioFim !== meal.horarioFim;
      });

      await Promise.all(changedMeals.map((meal) =>
        mealTypeService.updateMealType(
          meal.tipoRefeicaoId as number,
          {
            horario_inicio: inputTimeToApi(meal.horarioInicio),
            horario_fim: inputTimeToApi(meal.horarioFim),
          },
          requestContext,
        ),
      ));

      await settingsService.updateUnitPolicies(
        unitItem.id,
        mergeDynamicUnitPolicies(currentPolicies, data),
        requestContext,
      );
      await onSaved();
      showToast("Políticas salvas e propagadas com sucesso", "success");
      onClose();
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Erro ao salvar políticas";
      await reconcileAfterFailure(unitItem.id, message);
    } finally {
      setIsSaving(false);
    }
  };

  const disabled = isLoading || isSaving;
  const hasPendingMeal = fields.some((meal) => meal.isNew);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title="Políticas da Unidade"
        subtitle={unitItem?.nome}
        maxWidth="md"
        dialogSx={{
          width: "calc(100% - 32px)",
          maxWidth: "1000px",
          maxHeight: "calc(100% - 32px)",
          borderRadius: 4,
          "& .MuiDialogTitle-root": { px: 3, pt: 3, pb: 2 },
          "& .MuiDialogContent-root": { p: 3 },
        }}
      >
        {isLoading && fields.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" minHeight={320} gap={2}>
            <CircularProgress size={32} />
            <Typography color="text.secondary">Carregando políticas...</Typography>
          </Stack>
        ) : (
          <Stack gap={2.25} component="form" onSubmit={handleSubmit(onSubmit)}>
            {error && <Alert severity="error">{error}</Alert>}

            <MealScheduleSection
              fields={fields}
              register={register}
              errors={errors}
              disabled={disabled}
              hasPendingMeal={hasPendingMeal}
              onAddMeal={handleAddMeal}
            />

            <ConsumptionLimitsSection register={register} errors={errors} disabled={disabled} />

            <ClosableAlertBox
              severity="info"
              icon={<InfoOutlinedIcon />}
              title="Propagação Automática"
              description="Todas as políticas definidas aqui serão automaticamente aplicadas aos terminais vinculados a esta unidade. Os terminais receberão as atualizações na próxima sincronização."
            />

            <Box sx={{ borderTop: "1px solid", borderColor: "divider", pt: 2 }}>
              <Stack direction={{ xs: "column", sm: "row" }} gap={2}>
                <Button
                  type="button"
                  variant="outlined"
                  sx={{ flex: 1, minHeight: 56 }}
                  onClick={handleClose}
                  disabled={disabled}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ flex: 1, minHeight: 56 }}
                  disabled={disabled}
                >
                  {isSaving ? "Salvando..." : "Salvar e Propagar"}
                </Button>
              </Stack>
            </Box>
          </Stack>
        )}
      </Modal>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        autoHideDuration={toast.duration}
        onClose={closeToast}
      />
    </>
  );
}
