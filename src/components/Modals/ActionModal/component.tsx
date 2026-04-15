import { Box, Button, Dialog, Stack, Typography, useTheme } from "@mui/material";
import { ActionModalProps } from "./";

export function ActionModal({
  open,
  icon,
  title,
  subtitle,
  confirmLabel,
  cancelLabel,
  color = "success",
  onConfirm,
  onCancel
}: ActionModalProps) {
  const theme = useTheme();
  const confirmButtonBgColor =
    color === "primary"
      ? theme.palette.primary.main
      : theme.palette[color].contrastText;

  const confirmButtonHoverColor =
    color === "primary"
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary;

  const confirmButtonHoverBgColor =
    color === "primary"
      ? theme.palette.primary.dark
      : theme.palette[color].contrastText;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth={"sm"}
      fullWidth
      keepMounted={false}
      disableRestoreFocus
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            alignItems: "center",
            textAlign: "center",
            p: { xs: 2, md: 3 },
            gap: 2,
          },
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: theme.palette[color].main,
          color: theme.palette[color].contrastText,
          border: `1px solid ${theme.palette[color].light}`,
          borderRadius: "100%"
        }}
      >
        {icon}
      </Box>

      <Box maxWidth={{ sm: "90%", md: "70%" }}>
        <Typography variant="h6" fontWeight="500">{title}</Typography>
        <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
      </Box>

      <Stack direction={"row"} spacing={2} justifyContent="center" width={{ sm: "100%", md: "90%" }}>
        {
          cancelLabel && (
            <Button
              variant="outlined"
              sx={{
                flex: 1,
                transition: "all 0.2s ease-in-out",
                "&:hover": { color: "text.primary" },
              }}
              onClick={onCancel}
            >
              {cancelLabel}
            </Button>
          )
        }
        <Button
          variant="contained"
          sx={{
            flex: 1,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              color: confirmButtonHoverColor,
              bgcolor: confirmButtonHoverBgColor,
            },
            bgcolor: confirmButtonBgColor,
            color: theme.palette.primary.contrastText,
          }}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </Stack>
    </Dialog>
  );
}
