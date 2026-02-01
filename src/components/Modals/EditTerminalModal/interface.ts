import { ITerminal } from "@/Interfaces/Terminal/terminal";

/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface EditTerminalModalProps {
  open: boolean;
  onClose: () => void;
  terminal: ITerminal;
  onSave: (updatedTerminal: Partial<ITerminal>) => void;
}
