import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { StockToleranceType } from "@/Interfaces/Settings/settings";

interface ToleranceTypeSelectorProps {
  disabled: boolean;
  value: StockToleranceType;
  onChange: (value: StockToleranceType) => void;
}

export default function ToleranceTypeSelector({
  disabled,
  value,
  onChange,
}: ToleranceTypeSelectorProps) {
  return (
    <Box>
      <Typography color="text.label" mb={1}>
        Tipo de Tolerância
      </Typography>
      <ToggleButtonGroup
        exclusive
        fullWidth
        disabled={disabled}
        value={value}
        aria-label="Tipo de tolerância"
        onChange={(_, nextType: StockToleranceType | null) => {
          if (nextType && nextType !== value) onChange(nextType);
        }}
        sx={{
          gap: 1.5,
          "& .MuiToggleButtonGroup-grouped": {
            height: 56,
            margin: 0,
            border: "2px solid",
            borderColor: "divider",
            borderRadius: "14px !important",
            color: "text.label",
            fontWeight: 500,
            textTransform: "none",
          },
          "& .Mui-selected, & .Mui-selected:hover": {
            bgcolor: "primary.light",
            borderColor: "primary.main",
            color: "primary.main",
          },
        }}
      >
        <ToggleButton value="absoluto">Absoluto</ToggleButton>
        <ToggleButton value="percentual">Percentual</ToggleButton>
      </ToggleButtonGroup>
      {value === "percentual" && (
        <Typography variant="body2" color="text.secondary" mt={1}>
          Tolera ±X% do estoque teórico. A margem vale para mais e para menos.
        </Typography>
      )}
    </Box>
  );
}
