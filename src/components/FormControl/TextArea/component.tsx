import { FormControl, OutlinedInput, Typography } from "@mui/material";
import { TextAreaProps } from "./interface";

export function TextArea({
  label,
  optional = true,
  placeholder = "Digite aqui...",
  sx,
  rows = 4,
  maxRows = 8,
  error,
  register,
}: TextAreaProps) {
  return (
    <FormControl fullWidth>
      {label && (
        <Typography variant="body2" mb={1} color="text.label" fontWeight={400}>
          {label}{" "}
          <Typography
            variant="body2"
            component="span"
            color={!optional ? "primary.main" : "transparent"}
            sx={{ transition: "all 0.2s ease-in-out" }}>
            *
          </Typography>
        </Typography>
      )}

      <OutlinedInput
        {...register}
        placeholder={placeholder}
        multiline
        minRows={rows}
        maxRows={maxRows}
        sx={{
          borderRadius: 3,
          fontSize: 14,
          alignItems: "flex-start",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "divider",
            transition: "border-color 0.2s ease",
          },
          "& textarea::placeholder": {
            color: "text.secondary",
            opacity: 0.8,
          },
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
            },
          },
          ...sx,
        }}
      />
      <Typography
        variant="caption"
        color={error ? "error.contrastText" : "transparent"}>
        {error}
      </Typography>
    </FormControl>
  );
}
