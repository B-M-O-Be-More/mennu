export interface UploadImageModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  image: File | null;
  onSave: (file: File) => void;
}
