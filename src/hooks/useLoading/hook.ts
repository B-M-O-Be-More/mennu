"use client";

import React from "react";

export function useLoading() {
  const [isLoading, setIsLoading] = React.useState(false);

  const executeAsyncFunction = React.useCallback(
    async <T>(asyncFunction: () => Promise<T>): Promise<T> => {
      setIsLoading(true);
      try {
        return await asyncFunction();
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { isLoading, executeAsyncFunction };
}
