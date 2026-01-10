import React from "react";
import { Stack, Typography, Box, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { CSVIcon, FileIcon } from "../Icons";
import Modal from "../Modals/Modal";
import IconBox from "../Cards/IconBox";

interface ExportUsersModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ExportUsersModal({ open, onClose }: ExportUsersModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Importar Usuários"
      subtitle="Escolha o formato da importação"
    >
      <Stack gap={2}>
        <Stack
          direction="row"
          gap={2}
          border="3px solid"
          borderColor="divider"
          borderRadius={3}
          padding={2}
        >
          <IconBox
            icon={<FileIcon color="#E5E7EB" />}
            bgColor="#FF3D00"
            padding={2}
            borderRadius={3}
          />
          <Box component="span">
            <Typography variant="body1" color="text.primary">
              PDF
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Relatório completo com gráficos e métricas
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          gap={2}
          border="3px solid"
          borderColor="divider"
          borderRadius={3}
          padding={2}
        >
          <IconBox
            icon={<CSVIcon color="#198754" />}
            bgColor="#B8EBAD"
            padding={2}
            borderRadius={3}
          />
          <Box component="span">
            <Typography variant="body1" color="text.primary">
              CSV
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dados em formato de tabela separada por vírgulas
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            sx={{
              flex: 1,
              fontSize: "1.2rem",
              border: "1px solid",
              borderColor: "divider",
              color: "text.secondary",
              transition: "all 0.2s ease-in-out",
              "&:hover": { color: "text.primary" },
            }}
            onClick={() => { /* lógica para visualizar */ }}
          >
            Visualizar
          </Button>
          <Button
            sx={{
              flex: 1,
              fontSize: "1.2rem",
            }}
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => { /* lógica para baixar */ }}
          >
            Baixar
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
