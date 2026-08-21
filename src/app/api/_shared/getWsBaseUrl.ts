import { getApiBaseUrl } from "./getApiBaseUrl";

export function getWsBaseUrl(): string {
  const httpRoot = getApiBaseUrl().replace(/\/api\/?$/, "");
  return httpRoot.replace(/^http/, "ws");
}
