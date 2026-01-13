import { IStock } from "@/data/tableColumns";

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface EditStockModalProps {
  open: boolean;
  onClose: () => void;
  stockItem: IStock
  onSave: (updatedStock: Partial<IStock>) => void;
}
