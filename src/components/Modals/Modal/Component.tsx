import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ModalProps } from "./";

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  dialogSx,
}: ModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      keepMounted={false}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            ...dialogSx,
          },
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 1 }}>
        <Box component="span">
          <Typography variant="h3" fontWeight={"600"} color="text.primary">{title}</Typography>
          {subtitle && (
            <Typography variant="h6" fontWeight={"400"} color="text.secondary" >
              {subtitle}
            </Typography>
          )}
        </Box>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {children}
      </DialogContent>
    </Dialog>
  );
}