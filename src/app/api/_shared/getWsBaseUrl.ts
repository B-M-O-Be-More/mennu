import { getApiBaseUrl } from "./getApiBaseUrl";

export function getWsBaseUrl(): string {
  return getApiBaseUrl().replace(/^http/, "ws");
}
