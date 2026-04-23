import { Dayjs } from "dayjs";

export interface MenuPeriodModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (data: { start: Dayjs | null; end: Dayjs | null }) => void;
}
