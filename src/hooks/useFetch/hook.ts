import React from "react";
import { useLoading } from "../useLoading/hook";
import { FetchResponse, Options } from "./interface";

export default function useFetch<T>() {
  const [data, setData] = React.useState<T>();
  const { isLoading, executeAsyncFunction } = useLoading();

  const request = async (
    url: string,
    options: Options
  ): Promise<FetchResponse<T>> => {
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
      const res = await executeAsyncFunction(() =>
        fetch(`${url}?${params.toString()}`, config)
      );

      if (!res.ok) {
        const errorData = await res.json();
        return Promise.reject(
          new Error(errorData.message || "An error occurred")
        );
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
      return Promise.reject(new Error(errorMessage));
    }
  };

  return [request, isLoading, data] as const;
}
