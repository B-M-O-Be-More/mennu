import { ReactNode } from "react";

interface ExportOption {
  label: string;
  description: string;
  icon: ReactNode;
  bgColor: string;
  onPreview: () => void;
  onDownload: () => void;
}

export interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  options: ExportOption[];
}
