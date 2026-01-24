import { Box, Stack, Typography, Checkbox, FormGroup } from "@mui/material";
import { MealValidationListProps } from "./interface";
import Card from "@/components/Cards/Card";

export function MealValidationList({
  label,
  options,
  error,
  register,
}: MealValidationListProps) {
  return (
    <Card>
      <Typography variant="body1" mb={1} color="text.label" fontWeight={500}>
        {label}
        {""}
      </Typography>

      <FormGroup>
        {options.map((option) => (
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
              <Checkbox {...register} value={option.id} />
            </Stack>
          </Card>
        ))}
      </FormGroup>
    </Card>
  );
}
