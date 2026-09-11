import { Box, IconButton, Stack, Typography } from "@mui/material";
import { FieldArrayWithId, FieldErrors, UseFormRegister } from "react-hook-form";
import Input from "@/components/FormControl/Input";
import { PlusIcon } from "@/components/Icons";
import { UnitPoliciesFormValues } from "@/Interfaces/Settings/settings";

interface MealScheduleSectionProps {
  fields: FieldArrayWithId<UnitPoliciesFormValues, "tiposRefeicao", "id">[];
  register: UseFormRegister<UnitPoliciesFormValues>;
  errors: FieldErrors<UnitPoliciesFormValues>;
  disabled: boolean;
  hasPendingMeal: boolean;
  onAddMeal: () => void;
}

export default function MealScheduleSection({
  fields,
  register,
  errors,
  disabled,
  hasPendingMeal,
  onAddMeal,
}: MealScheduleSectionProps) {
  const collectionError = typeof errors.tiposRefeicao?.message === "string"
    ? errors.tiposRefeicao.message
    : null;

  return (
    <Stack gap={3} border="1px solid" borderColor="divider" padding={3} borderRadius={4}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" fontWeight={400}>Horários por Refeição</Typography>
        <IconButton
          type="button"
          aria-label="Adicionar tipo de refeição"
          onClick={onAddMeal}
          disabled={disabled || hasPendingMeal}
          sx={{
            width: 50,
            height: 50,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            color: "text.primary",
          }}
        >
          <PlusIcon width={24} height={24} />
        </IconButton>
      </Stack>

      {fields.length === 0 && (
        <Typography color="text.secondary" textAlign="center" py={2}>
          Nenhum tipo de refeição cadastrado para esta unidade.
        </Typography>
      )}

      <Stack gap={3}>
        {fields.map((meal, index) => (
          <Box
            key={meal.id}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(180px, 1fr) minmax(180px, 1fr) minmax(180px, 1fr)",
              },
              gap: 3,
              alignItems: "center",
              bgcolor: "background.default",
              borderRadius: 3,
              p: 2,
            }}
          >
            {meal.isNew ? (
              <Input
                label="Nome"
                placeholder="Ex. Ceia"
                optional={false}
                register={register(`tiposRefeicao.${index}.nome`)}
                error={errors.tiposRefeicao?.[index]?.nome?.message}
                disabled={disabled}
              />
            ) : (
              <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                {meal.nome}
              </Typography>
            )}

            <Input
              label="Início"
              type="time"
              optional={false}
              register={register(`tiposRefeicao.${index}.horarioInicio`)}
              error={errors.tiposRefeicao?.[index]?.horarioInicio?.message}
              disabled={disabled}
            />
            <Input
              label="Fim"
              type="time"
              optional={false}
              register={register(`tiposRefeicao.${index}.horarioFim`)}
              error={errors.tiposRefeicao?.[index]?.horarioFim?.message}
              disabled={disabled}
            />
          </Box>
        ))}
      </Stack>

      {collectionError && (
        <Typography variant="caption" color="error.contrastText">
          {collectionError}
        </Typography>
      )}
    </Stack>
  );
}
