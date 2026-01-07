import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";

interface ModalGenericProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function ModalGeneric({
  open,
  onClose,
  title,
  subtitle,
  children,
}: ModalGenericProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
          },
        }

      }}>
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