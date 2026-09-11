import { UnitListItem } from "@/Interfaces/Settings/settings";
export interface EditUnitModalProps {
  open: boolean;
  onClose: () => void;
  unitItem: UnitListItem | null;
  onSaved: () => Promise<void> | void;
}
