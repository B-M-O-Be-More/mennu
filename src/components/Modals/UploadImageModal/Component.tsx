import {
  Alert,
  Box,
  Button,
  Collapse,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import Modal from "../Modal";
import ClosableAlertBox from "@/components/ClosableAlertBox";
import { ImageIcon } from "@/components/Icons";
import React from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { UploadImageModalProps } from "./";
import {
  createCroppedLogoFile,
  LOGO_ASPECT_RATIO,
  validateLogoDimensions,
  validateLogoFile,
} from "./cropLogo";

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
  const [crop, setCrop] = React.useState<Crop>();
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const imageRef = React.useRef<HTMLImageElement | null>(null);

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
    if (open) {
      setTempImage(image);
      setCrop(undefined);
      setCompletedCrop(undefined);
      setSaveError(null);
    }
  }, [open, image]);

  const resetAndClose = () => {
    if (isSaving) return;
    setTempImage(image);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setSaveError(null);
    onClose();
  };

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const loadedImage = event.currentTarget;
    imageRef.current = loadedImage;

    const dimensionError = validateLogoDimensions(loadedImage);
    if (dimensionError) {
      setSaveError(dimensionError);
      setCrop(undefined);
      setCompletedCrop(undefined);
      return;
    }

    const { naturalWidth: width, naturalHeight: height } = loadedImage;
    const sourceAspect = width / height;
    const initialCrop = makeAspectCrop(
      sourceAspect > LOGO_ASPECT_RATIO
        ? { unit: "%", height: 90 }
        : { unit: "%", width: 90 },
      LOGO_ASPECT_RATIO,
      width,
      height,
    );

    setCrop(centerCrop(initialCrop, width, height));
    setSaveError(null);
  };

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title={title}
      subtitle={subtitle}
      maxWidth="md"
    >
      <Stack gap={2}>
        {saveError && <Alert severity="error">{saveError}</Alert>}
        <ClosableAlertBox
          severity="info"
          icon={<ImageIcon color={theme.palette.info.contrastText} />}
          title="Logo do Sistema"
          description="Posicione a marca dentro da área horizontal. O recorte será salvo em PNG na proporção 18:5 (864×240 px)."
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
                accept="image/jpeg,image/png,image/svg+xml"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const validationError = validateLogoFile(file);
                  if (validationError) {
                    setSaveError(validationError);
                    e.target.value = "";
                    return;
                  }

                  setSaveError(null);
                  setCrop(undefined);
                  setCompletedCrop(undefined);
                  setTempImage(file);
                  e.target.value = "";
                }}
              />
            </Button>
            <Typography variant="body2" alignSelf="center">
              {tempImage ? tempImage.name : "Nenhuma imagem selecionada"}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            JPG, PNG ou SVG, até 2 MB e 4000×4000 px.
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
                Ajuste o recorte
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Arraste a seleção ou use o teclado para escolher a área que aparecerá na sidebar.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  overflow: "auto",
                  borderRadius: 2,
                  bgcolor: "background.default",
                  p: 1,
                }}
              >
                <ReactCrop
                  crop={crop}
                  aspect={LOGO_ASPECT_RATIO}
                  keepSelection
                  ruleOfThirds
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
                >
                  <Box
                    component="img"
                    ref={imageRef}
                    src={previewUrl}
                    alt="Imagem selecionada para recorte do logo"
                    onLoad={handleImageLoad}
                    onError={() => {
                      setSaveError("Não foi possível abrir esta imagem.");
                      setCrop(undefined);
                      setCompletedCrop(undefined);
                    }}
                    sx={{
                      display: "block",
                      maxWidth: "100%",
                      maxHeight: 360,
                      objectFit: "contain",
                    }}
                  />
                </ReactCrop>
              </Box>
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
            disabled={isSaving}
            onClick={resetAndClose}
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
            disabled={!tempImage || !completedCrop || !!saveError || isSaving}
            onClick={async () => {
              if (!tempImage || !completedCrop || !imageRef.current) return;
              setIsSaving(true);
              setSaveError(null);
              try {
                const croppedFile = await createCroppedLogoFile(
                  imageRef.current,
                  completedCrop,
                  tempImage.name,
                );
                await onSave(croppedFile);
                onClose();
              } catch (error) {
                setSaveError(error instanceof Error ? error.message : "Não foi possível enviar a imagem");
              } finally {
                setIsSaving(false);
              }
            }}
          >
            {isSaving ? "Enviando..." : "Salvar"}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
}
