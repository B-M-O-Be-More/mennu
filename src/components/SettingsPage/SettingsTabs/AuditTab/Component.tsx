"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "@/components/FormControl/Input";
import Toast from "@/components/Toast";
import { StockSettingsApi } from "@/Interfaces/Settings/settings";
import { useToast } from "@/hooks/useToast/hook";
import {
  StockSettingsFormData,
  stockSettingsSchema,
} from "@/schemas/stockSettingsSchema";
import { settingsService } from "@/services/settingsService";
import {
  apiDecimalToInput,
  inputDecimalToApi,
} from "@/utils/decimalInputAdapter";
import AuditMarginInfo from "./AuditMarginInfo";
import ToleranceTypeSelector from "./ToleranceTypeSelector";

const DEFAULT_VALUES: StockSettingsFormData = {
  toleranceType: "absoluto",
  toleranceMargin: "0",
};

function toFormValues(settings: StockSettingsApi): StockSettingsFormData {
  return {
    toleranceType: settings.margem_tolerancia_tipo,
    toleranceMargin: apiDecimalToInput(settings.margem_tolerancia_padrao),
  };
}

export default function AuditTab() {
  const { toast, showToast, closeToast } = useToast();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const isMounted = React.useRef(true);
  const requestId = React.useRef(0);
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<StockSettingsFormData>({
    resolver: yupResolver(stockSettingsSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const toleranceType = watch("toleranceType");

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  React.useEffect(() => {
    const currentRequest = ++requestId.current;
    setError(null);
    setIsLoading(true);

    settingsService
      .getStockSettings()
      .then((settings) => {
        if (currentRequest === requestId.current) reset(toFormValues(settings));
      })
      .catch((loadError: unknown) => {
        if (currentRequest !== requestId.current) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Erro ao carregar configurações de auditoria",
        );
      })
      .finally(() => {
        if (currentRequest === requestId.current) setIsLoading(false);
      });

    return () => {
      requestId.current += 1;
    };
  }, [reset]);

  const onSubmit = async (data: StockSettingsFormData) => {
    if (isSaving) return;

    setError(null);
    setIsSaving(true);
    try {
      const updated = await settingsService.updateStockSettings({
        margem_tolerancia_padrao: inputDecimalToApi(data.toleranceMargin),
        margem_tolerancia_tipo: data.toleranceType,
      });
      if (!isMounted.current) return;
      reset(toFormValues(updated));
      showToast("Configurações de auditoria salvas com sucesso", "success");
    } catch (saveError) {
      if (!isMounted.current) return;
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Erro ao salvar configurações de auditoria",
      );
    } finally {
      if (isMounted.current) setIsSaving(false);
    }
  };

  const disabled = isLoading || isSaving;
  const saveDisabled = disabled || !isDirty || !isValid;

  return (
    <>
      <Typography fontSize={24} fontWeight={400}>
        Configurações de Auditoria
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: { xs: "auto", md: 520 },
        }}
      >
        <Grid container spacing={3} mt={0.5} flex={1}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Stack gap={2}>
              <Controller
                name="toleranceType"
                control={control}
                render={({ field }) => (
                  <ToleranceTypeSelector
                    disabled={disabled}
                    value={field.value}
                    onChange={(nextType) => {
                      field.onChange(nextType);
                      setValue("toleranceMargin", "0", {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  />
                )}
              />

              <Input
                label="Margem de Tolerância"
                placeholder="Ex: 2"
                register={register("toleranceMargin")}
                error={errors.toleranceMargin?.message}
                disabled={disabled}
                inputMode="decimal"
                suffix={toleranceType === "percentual" ? "%" : "unid."}
              />

              <Typography variant="body2" color="info.contrastText">
                A margem é congelada no envio de cada auditoria, não afeta
                auditorias já enviadas.
              </Typography>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <AuditMarginInfo />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          type="submit"
          disabled={saveDisabled}
          sx={{
            width: { xs: "100%", sm: 238 },
            mt: 3,
            "&.Mui-disabled": {
              bgcolor: "#FFC2B0",
              color: "primary.contrastText",
            },
          }}
        >
          {isSaving && <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />}
          {isSaving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </Box>

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
