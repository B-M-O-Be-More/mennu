import React from "react";
import { useLoading } from "../useLoading/hook";
import { FetchResponse, Options } from "./interface";

export default function useFetch<T>() {
  const [data, setData] = React.useState<T>();
  const [error, setError] = React.useState<string | null>(null);
  const { isLoading, executeAsyncFunction } = useLoading();

  const request = React.useCallback(
    async (url: string, options: Options): Promise<FetchResponse<T>> => {
      setError(null);
      const params = new URLSearchParams();

      if (options.params) {
        Object.entries(options.params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((item) => params.append(`${key}[]`, item));
          } else {
            params.append(key, String(value));
          }
        });
      }

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers || {}),
      };

      const config: RequestInit = {
        method: options.method,
        headers,
      };

      if (options.method !== "GET" && options.body) {
        config.body = JSON.stringify(options.body);
      }

      try {
        const queryString = params.toString();
        const requestUrl = queryString ? `${url}?${queryString}` : url;

        const res = await executeAsyncFunction(() => fetch(requestUrl, config));

        if (!res.ok) {
          const errorData = await res.json();
          const message = errorData.message || "An error occurred";
          setError(message);
          return Promise.reject(new Error(message));
        }

        const responseData = await res.json();
        setData(responseData.data as T);
        return Promise.resolve({
          ...responseData,
          message: responseData.message || null,
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setError(errorMessage);
        return Promise.reject(new Error(errorMessage));
      }
    },
    [executeAsyncFunction],
  );

  return [request, isLoading, data, error] as const;
}
