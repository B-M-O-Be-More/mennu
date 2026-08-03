import { ITerminalAccessResult } from "@/Interfaces/Terminal/terminal";

export interface ErrorTabProps {
  setTab: (tabIndex: number) => void;
  accessResult?: ITerminalAccessResult;
}