import { Box, Stack, Typography } from "@mui/material";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import Input from "@/components/FormControl/Input";
import { UnitPoliciesFormValues } from "@/Interfaces/Settings/settings";

interface ConsumptionLimitsSectionProps {
  register: UseFormRegister<UnitPoliciesFormValues>;
  errors: FieldErrors<UnitPoliciesFormValues>;
  disabled: boolean;
}

const limitFields = [
  { name: "diario" as const, label: "Limite Diário", description: "Refeições por dia" },
  { name: "semanal" as const, label: "Limite Semanal", description: "Refeições por semana" },
  { name: "mensal" as const, label: "Limite Mensal", description: "Refeições por mês" },
];

export default function ConsumptionLimitsSection({
  register,
  errors,
  disabled,
}: ConsumptionLimitsSectionProps) {
  return (
    <Stack gap={2.25} border="1px solid" borderColor="divider" padding={3} borderRadius={4}>
      <Typography variant="h6" fontWeight={400}>Limites de Consumo</Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
          gap: 3,
        }}
      >
        {limitFields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            type="number"
            optional={false}
            description={field.description}
            register={register(`limites.${field.name}`, { valueAsNumber: true })}
            error={errors.limites?.[field.name]?.message}
            disabled={disabled}
          />
        ))}
      </Box>
    </Stack>
  );
}
