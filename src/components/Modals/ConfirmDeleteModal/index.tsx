import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import Modal from "../Modal";
import { TrashIcon } from "@/components/Icons";
import React from "react";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title = "Confirmar exclusão",
  description,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="xs">
      <Stack gap={3} py={1}>
        <Stack direction="row" gap={2} alignItems="flex-start">
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: "error.light",
              flexShrink: 0,
            }}
          >
            <TrashIcon color="#E7000B" width={22} height={22} />
          </Stack>
          <Typography variant="body2" color="text.secondary" pt={0.5}>
            {description ?? "Esta ação não pode ser desfeita. O item será removido permanentemente."}
          </Typography>
        </Stack>

        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ border: "1px solid", borderColor: "divider", color: "text.secondary" }}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} color="inherit" /> : "Excluir"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
