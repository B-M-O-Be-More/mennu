export interface TerminalSocketEvent {
  type: string;
  terminal_id: number;
  [key: string]: unknown;
}

export interface UseTerminalSocketOptions {
  onEvent?: (event: TerminalSocketEvent) => void;
}

export interface UseTerminalSocketResult {
  connected: boolean;
}
