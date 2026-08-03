import { ITerminalAccessResult } from "@/Interfaces/Terminal/terminal";

export interface SuccessTabProps {
  setTab: (tabIndex: number) => void;
  accessResult?: ITerminalAccessResult;
}