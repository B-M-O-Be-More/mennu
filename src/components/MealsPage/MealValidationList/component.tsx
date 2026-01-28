import { Box, Stack, Typography, Checkbox, FormGroup } from "@mui/material";
import { MealValidationListProps } from "./interface";
import Card from "@/components/Cards/Card";
import { Controller } from "react-hook-form";

export function MealValidationList({
  label,
  options,
  name,
  control,
}: MealValidationListProps) {
  return (
    <Card>
      <Typography variant="body1" mb={1} color="text.label" fontWeight={500}>
        {label}
        {""}
      </Typography>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const values: string[] = field.value || [];

          return (
            <FormGroup>
              {options.map((option) => {
                const checked = values.includes(option.id);

                return (
                  <Card padding={2} mb={1} key={option.id}>
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Stack direction={"row"} gap={2} alignItems={"center"}>
                        {option.icon}
                        <Box>
                          <Typography
                            variant="body1"
                            fontWeight={500}
                            color="text.primary">
                            {option.label}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight="400"
                            color="text.secondary">
                            {option.description}
                          </Typography>
                        </Box>
                      </Stack>
                      <Checkbox
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange([...values, option.id]);
                          } else {
                            field.onChange(
                              values.filter((v) => v !== option.id),
                            );
                          }
                        }}
                      />
                    </Stack>
                  </Card>
                );
              })}
            </FormGroup>
          );
        }}
      />
    </Card>
  );
}
