import { Stack, Typography, Button, useTheme, Collapse } from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import Modal from "../Modal";
import ClosableAlertBox from "@/components/ClosableAlertBox";
import { ImageIcon } from "@/components/Icons";
import React from "react";
import { UploadImageModalProps } from "./";

export default function UploadImageModal({
  open,
  onClose,
  title,
  subtitle,
  image,
  onSave,
}: UploadImageModalProps) {
  const theme = useTheme();

  const [tempImage, setTempImage] = React.useState<File | null>(image);

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!tempImage) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(tempImage);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [tempImage]);


  React.useEffect(() => {
    if (open) setTempImage(image);
  }, [open, image]);

  return (
    <Modal open={open} onClose={onClose} title={title} subtitle={subtitle}>
      <Stack gap={2}>
        <ClosableAlertBox
          severity="info"
          icon={<ImageIcon color={theme.palette.info.contrastText} />}
          title="Logo do Sistema"
          description="Escolha uma imagem que representará o sistema Mennu em todas as telas e terminais. Recomendado: imagem quadrada, fundo transparente."
          isCloseable={false}
        />

        <Stack gap={1}>
          <Typography variant="body2" fontWeight={400} color="text.label">
            Selecione uma imagem
          </Typography>
          <Stack
            direction="row"
            gap={1}
            border={"1px solid"}
            borderColor={"divider"}
            width={"100%"}
            padding={1}
            borderRadius={3}
          >
            <Button
              variant="text"
              component="label"
              sx={{
                textTransform: "none",
                fontWeight: 400,
                bgcolor: "#FFE9E3",
                borderRadius: 3,
                px: 1.6,
              }}
            >
              {tempImage ? "Alterar" : "Escolher"} Imagem
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const maxSizeMB = 2;
                  const maxSizeBytes = maxSizeMB * 1024 * 1024;

                  if (file.size > maxSizeBytes) {
                    alert(`Arquivo muito grande! O limite é ${maxSizeMB}MB.`);
                    e.target.value = "";
                    return;
                  }

                  setTempImage(file);
                }}
              />
            </Button>
            <Typography variant="body2" alignSelf="center">
              {tempImage ? tempImage.name : "Nenhuma imagem selecionada"}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Formatos aceitos: JPG, PNG, SVG (máx. 2MB)
          </Typography>
        </Stack>

        <Collapse in={!!previewUrl}>
          {previewUrl && (
            <Stack
              border={"1px solid"}
              borderColor={"divider"}
              padding={2}
              gap={2}
              borderRadius={3}
            >
              <Typography variant="body2" fontWeight={400} color="text.label" mb={1}>
                Preview da Imagem
              </Typography>
              <img
                src={previewUrl ?? ""}
                alt="Preview da Imagem"
                style={{
                  maxWidth: "100%",
                  maxHeight: 200,
                  borderRadius: 8,
                  backgroundColor: theme.palette.background.default,
                }}
              />
            </Stack>
          )}
        </Collapse>

        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            sx={{
              flex: 1,
              fontSize: "1.2rem",
              paddingY: 1,
              fontWeight: 400,
              color: "text.secondary",
              borderRadius: 2,
            }}
            onClick={() => {
              setTempImage(image);
              onClose();
            }}
          >
            Cancelar
          </Button>
          <Button
            sx={{
              flex: 1,
              fontSize: "1.2rem",
              paddingY: 1,
              fontWeight: 400,
              borderRadius: 2,
            }}
            variant="contained"
            startIcon={<DownloadIcon />}
            disabled={!tempImage}
            onClick={() => {
              if (tempImage) {
                onSave(tempImage);
              }
              onClose();
            }}
          >
            Salvar
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
