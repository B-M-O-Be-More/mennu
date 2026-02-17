// SparkLineChart.tsx
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PercentageLineChartProps } from "./";

export default function PercentageLineChart({ value, height = 8 }: PercentageLineChartProps) {
  const theme = useTheme();

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Box
        sx={{
          flexGrow: 1,
          height,
          borderRadius: height / 2,
          backgroundColor: theme.palette.divider,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: `${value}%`,
            height: "100%",
            backgroundColor: theme.palette.primary.main,
          }}
        />
      </Box>

      <Typography variant="body2" color="text.secondary">
        {value}%
      </Typography>
    </Box>
  );
}
