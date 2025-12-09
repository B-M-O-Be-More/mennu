import { InputAdornment, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { InputProps } from "./interface";

export const RoundedTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    fontSize: "18px",
  },
}));

export function Input({ label, startIcon, ...props }: InputProps) {
  return (
    <Stack width={"100%"} spacing={1}>
      <Typography fontSize={"18px"} color="text.label" fontWeight={"400"}>
        {label}
      </Typography>
      <RoundedTextField
        slotProps={{
          input: {
            startAdornment: startIcon ? (
              <InputAdornment position="start" sx={{ mr: "18px" }}>
                {startIcon}
              </InputAdornment>
            ) : undefined,
          },
        }}
        fullWidth
        {...props}
      />
    </Stack>
  );
}
