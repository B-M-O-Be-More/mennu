import type { PixelCrop } from "react-image-crop";

export const LOGO_ASPECT_RATIO = 18 / 5;
export const LOGO_OUTPUT_WIDTH = 864;
export const LOGO_OUTPUT_HEIGHT = 240;
export const LOGO_MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
export const LOGO_MAX_SOURCE_DIMENSION = 4000;

const ALLOWED_LOGO_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/svg+xml",
]);

export function validateLogoFile(file: File): string | null {
  if (!ALLOWED_LOGO_TYPES.has(file.type)) {
    return "Selecione uma imagem JPG, PNG ou SVG.";
  }

  if (file.size > LOGO_MAX_FILE_SIZE_BYTES) {
    return "A imagem deve ter no máximo 2 MB.";
  }

  return null;
}

export function validateLogoDimensions(image: HTMLImageElement): string | null {
  if (
    image.naturalWidth > LOGO_MAX_SOURCE_DIMENSION ||
    image.naturalHeight > LOGO_MAX_SOURCE_DIMENSION
  ) {
    return "A imagem deve ter no máximo 4000×4000 px.";
  }

  return null;
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("Não foi possível gerar a imagem recortada."));
    }, "image/png");
  });
}

export async function createCroppedLogoFile(
  image: HTMLImageElement,
  crop: PixelCrop,
  originalName: string,
): Promise<File> {
  if (crop.width <= 0 || crop.height <= 0) {
    throw new Error("Ajuste a área de recorte antes de salvar.");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const canvas = document.createElement("canvas");
  canvas.width = LOGO_OUTPUT_WIDTH;
  canvas.height = LOGO_OUTPUT_HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Seu navegador não conseguiu processar a imagem.");
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const blob = await canvasToPngBlob(canvas);
  if (blob.size > LOGO_MAX_FILE_SIZE_BYTES) {
    throw new Error("O recorte gerado ultrapassou o limite de 2 MB.");
  }

  const baseName = originalName.replace(/\.[^.]+$/, "") || "logo";
  return new File([blob], `${baseName}-recortado.png`, {
    type: "image/png",
    lastModified: Date.now(),
  });
}
