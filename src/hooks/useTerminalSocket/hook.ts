import React from "react";
import {
  TerminalSocketEvent,
  UseTerminalSocketOptions,
  UseTerminalSocketResult,
} from "./interface";

const INITIAL_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30000;

/**
 * Conecta ao WebSocket de monitoramento de terminais (ws/terminais/ no backend).
 * Autenticação via ticket de curta duração mintado em /api/terminais/ws-ticket
 * e passado como subprotocolo "token-<ticket>" — o mesmo padrão que o serviço
 * do terminal físico usa com seu próprio service_token.
 */
export function useTerminalSocket({
  onEvent,
}: UseTerminalSocketOptions = {}): UseTerminalSocketResult {
  const [connected, setConnected] = React.useState(false);

  const socketRef = React.useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const backoffRef = React.useRef(INITIAL_BACKOFF_MS);
  const stoppedRef = React.useRef(false);
  const onEventRef = React.useRef(onEvent);
  onEventRef.current = onEvent;

  const scheduleReconnect = React.useCallback((connectFn: () => void) => {
    if (stoppedRef.current) return;
    reconnectTimeoutRef.current = setTimeout(() => {
      backoffRef.current = Math.min(backoffRef.current * 2, MAX_BACKOFF_MS);
      connectFn();
    }, backoffRef.current);
  }, []);

  React.useEffect(() => {
    stoppedRef.current = false;

    const connect = async () => {
      if (stoppedRef.current) return;

      try {
        const res = await fetch("/api/terminais/ws-ticket", { method: "POST" });
        if (!res.ok) throw new Error("Falha ao obter ticket de WebSocket");
        const { ticket, ws_url } = await res.json();

        if (stoppedRef.current) return;

        const socket = new WebSocket(ws_url, [`token-${ticket}`]);
        socketRef.current = socket;

        socket.onopen = () => {
          setConnected(true);
          backoffRef.current = INITIAL_BACKOFF_MS;
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as TerminalSocketEvent;
            onEventRef.current?.(data);
          } catch {
            // mensagem malformada — ignora
          }
        };

        socket.onerror = () => {
          socket.close();
        };

        socket.onclose = () => {
          setConnected(false);
          socketRef.current = null;
          scheduleReconnect(connect);
        };
      } catch {
        setConnected(false);
        scheduleReconnect(connect);
      }
    };

    connect();

    return () => {
      stoppedRef.current = true;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [scheduleReconnect]);

  return { connected };
}
