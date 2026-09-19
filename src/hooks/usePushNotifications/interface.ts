export type PushPermissionState = "unsupported" | "default" | "granted" | "denied";

export interface RequestPermissionResult {
  success: boolean;
  message?: string;
}

export interface UsePushNotificationsReturn {
  permission: PushPermissionState;
  isRegistering: boolean;
  requestPermission: () => Promise<RequestPermissionResult>;
}
