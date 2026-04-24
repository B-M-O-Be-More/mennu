import { ITerminal } from "@/Interfaces/Terminal/terminal";

export interface EditTerminalModalProps {
  open: boolean;
  onClose: () => void;
  terminal: ITerminal;
  onSave: () => void;
}
