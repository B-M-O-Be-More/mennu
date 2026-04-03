import { IStock } from "@/Interfaces/Stock/stock";

export interface EditStockModalProps {
  open: boolean;
  onClose: () => void;
  stockItem: IStock;
  onSave: (updatedStock: Partial<IStock>) => void;
}
