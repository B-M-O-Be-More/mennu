import Card from "@/components/Cards/Card";
import { MealRuleItemProps } from "./interface";
import { Typography } from "@mui/material";

export function MealRuleItem({ label, description, value }: MealRuleItemProps) {

  return (
    <Card
      variant={"compact"}
      sx={{ padding: "1rem", maxWidth: { lg: "48%" }, minWidth: "48%" }}>
      <Typography variant={"body2"} color="text.secondary">
        {label}
      </Typography>
      <Typography variant={"h4"} fontWeight={500}>
        {value}
      </Typography>
      <Typography variant={"body2"} color="text.secondary">
        {description}
      </Typography>
    </Card>
  );
}
