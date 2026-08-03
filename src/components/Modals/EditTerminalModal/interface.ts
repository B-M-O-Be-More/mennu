import { ITerminal } from "@/Interfaces/Terminal/terminal";
import { CreateTerminalSchemaFormData } from "@/schemas/terminalSchema";

export interface EditTerminalModalProps {
  open: boolean;
  onClose: () => void;
  terminal: ITerminal;
  onSave: (data: CreateTerminalSchemaFormData) => void;
}
