"use client";

import React from "react";
import { getFirebaseMessaging, getToken, onMessage } from "@/utils/firebase";
import {
  PushPermissionState,
  RequestPermissionResult,
  UsePushNotificationsReturn,
} from "./interface";

function getInitialPermission(): PushPermissionState {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    !("serviceWorker" in navigator)
  ) {
    return "unsupported";
  }
  return Notification.permission;
}

/**
 * Ativa notificações desktop/navegador via FCM. Pede permissão, registra o
 * service worker e envia o token pro Novu através do BFF.
 */
export function usePushNotifications(): UsePushNotificationsReturn {
  const [permission, setPermission] = React.useState<PushPermissionState>(
    getInitialPermission,
  );
  const [isRegistering, setIsRegistering] = React.useState(false);

  // FCM não mostra notificação sozinho com a aba em foco — precisa exibir na mão.
  // Usa `registration.showNotification` (não `new Notification`) pra ficar
  // igual ao service worker e não depender de payload trazer `notification`
  // (mensagens data-only do Novu também precisam aparecer).
  React.useEffect(() => {
    if (permission !== "granted") return;

    let unsubscribe: (() => void) | undefined;

    getFirebaseMessaging().then((messaging) => {
      if (!messaging) return;
      unsubscribe = onMessage(messaging, (payload) => {
        console.debug("[push] mensagem em primeiro plano recebida", payload);
        const notification = payload.notification ?? {};
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(notification.title || "Mennu", {
            body: notification.body,
            icon: "/assets/logo.svg",
            data: payload.data,
          });
        });
      });
    });

    return () => unsubscribe?.();
  }, [permission]);

  const requestPermission =
    React.useCallback(async (): Promise<RequestPermissionResult> => {
      setIsRegistering(true);
      try {
        const messaging = await getFirebaseMessaging();
        if (!messaging) {
          setPermission("unsupported");
          return { success: false, message: "Navegador não suporta notificações" };
        }

        const result = await Notification.requestPermission();
        setPermission(result);
        if (result !== "granted") {
          return { success: false, message: "Permissão de notificações negada" };
        }

        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
        );
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (!token) {
          return { success: false, message: "Não foi possível gerar o token de push" };
        }
        console.debug("[push] token FCM gerado", token.slice(0, 12) + "…");

        const response = await fetch("/api/notificacoes/push-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          console.error("[push] falha ao registrar token no Novu", response.status, data);
          return {
            success: false,
            message: data?.message ?? "Falha ao registrar notificações",
          };
        }

        console.debug("[push] token registrado no Novu com sucesso");
        return { success: true };
      } catch (error) {
        console.error("[push] erro ao ativar notificações", error);
        return {
          success: false,
          message: error instanceof Error ? error.message : "Erro ao ativar notificações",
        };
      } finally {
        setIsRegistering(false);
      }
    }, []);

  return { permission, isRegistering, requestPermission };
}
