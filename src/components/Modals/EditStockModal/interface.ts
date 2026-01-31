import { IStock } from "@/Interfaces/Stock/stock";

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface EditStockModalProps {
  open: boolean;
  onClose: () => void;
  stockItem: IStock
  onSave: (updatedStock: Partial<IStock>) => void;
}
