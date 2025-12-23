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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 1 }}>
        <Box component="span">
          <Typography fontSize={"18px"} fontWeight={"600"} color="#0C0813">{title}</Typography>
          {subtitle && (
            <Typography color="#6C757D" fontSize={"14px"} fontWeight={"400"} >
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