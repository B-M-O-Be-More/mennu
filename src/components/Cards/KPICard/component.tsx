import { Stack, Typography } from "@mui/material";
import Card from "../Card";
import { KPICardProps } from "./interface";
import IconBox from "../IconBox";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

export function KPICard({
  label,
  value,
  unit,
  icon,
  bgColor,
  trend,
  description,
}: KPICardProps) {
  const trendColor = trend
    ? trend > 0
      ? "success.contrastText"
      : trend < 0
        ? "error.contrastText"
        : "text.primary"
    : undefined;
  return (
    <Card sx={{ padding: 2 }}>
      <Stack
        direction={"row"}
        gap={2}
        alignItems={"center"}
        justifyContent={"space-between"}>
        <Stack gap={0.5}>
          <Typography variant="h6" fontWeight={400} color="text.primary">
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Últimos 7 dias
          </Typography>
        </Stack>
        <IconBox icon={icon} bgColor={bgColor} padding={2} borderRadius={3} />
      </Stack>
      <Typography variant="h4" fontWeight={500}>
        {value}
        {unit}
      </Typography>

      {typeof trend === "number" ? (
        <Stack direction="row" gap={1} alignItems="center">
          {trend !== 0 &&
            (trend > 0 ? (
              <TrendingUp sx={{ color: trendColor }} />
            ) : (
              <TrendingDown sx={{ color: trendColor }} />
            ))}
          <Typography variant="body2" color={trendColor}>
            {trend}% vs semana anterior
          </Typography>
        </Stack>
      ) : description ? (
        <Typography variant="body2" color="info.contrastText">
          {description}
        </Typography>
      ) : null}
    </Card>
  );
}
