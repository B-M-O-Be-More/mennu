import { UnitListItem } from "@/Interfaces/Settings/settings";
export interface UnitPoliciesModalProps {
  open: boolean;
  onClose: () => void;
  unitItem: UnitListItem | null;
  onSaved: () => Promise<void> | void;
}
