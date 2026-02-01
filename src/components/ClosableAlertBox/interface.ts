/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ClosableAlertBoxProps {
  icon: React.ReactNode;
  severity: "success" | "error" | "warning" | "info" | "default" | "purple";
  title: string;
  description: string;
}
