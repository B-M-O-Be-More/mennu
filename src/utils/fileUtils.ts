export async function urlToFile(url: string, filename: string): Promise<File | null> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Erro ao buscar arquivo: ${response.status} ${response.statusText}`);
      return null;
    }

    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error("Falha na requisição de arquivo:", error);
    return null;
  }
}

export function fileToFileList(file: File): FileList {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  return dataTransfer.files;
}
