import { IUnit } from "@/data/tableColumns";

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface UnitPoliciesModalProps {
  open: boolean;
  onClose: () => void;
  unitItem: IUnit | null;
  onSave: (updatedUnit: Partial<IUnit>) => void;
}
