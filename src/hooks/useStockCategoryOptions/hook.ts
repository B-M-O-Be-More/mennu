"use client";

import * as React from "react";

function normalizeCategories(payload: unknown) {
  if (!Array.isArray(payload)) {
    throw new Error("Formato inválido ao carregar categorias");
  }

  const uniqueCategories = new Map<string, string>();

  payload.forEach((rawCategory) => {
    if (typeof rawCategory !== "string") return;

    const category = rawCategory.trim();
    if (!category) return;

    const normalizedKey = category.toLocaleLowerCase("pt-BR");
    if (!uniqueCategories.has(normalizedKey)) {
      uniqueCategories.set(normalizedKey, category);
    }
  });

  return Array.from(uniqueCategories.values()).sort((a, b) =>
    a.localeCompare(b, "pt-BR", { sensitivity: "base" }),
  );
}

interface CategoryRequest {
  controller: AbortController;
  promise: Promise<string[]>;
  subscribers: number;
}

let activeCategoryRequest: CategoryRequest | null = null;

function createCategoryRequest() {
  const controller = new AbortController();
  const request = {} as CategoryRequest;

  request.controller = controller;
  request.subscribers = 0;
  request.promise = fetch("/api/insumo/categorias", {
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Erro ao carregar categorias" }));
        throw new Error(errorData.message ?? "Erro ao carregar categorias");
      }

      const payload: unknown = await response.json();
      return normalizeCategories(payload);
    })
    .finally(() => {
      if (activeCategoryRequest === request) {
        activeCategoryRequest = null;
      }
    });

  activeCategoryRequest = request;
  return request;
}

function subscribeToCategoryRequest() {
  const request = activeCategoryRequest ?? createCategoryRequest();
  request.subscribers += 1;

  let released = false;

  return {
    promise: request.promise,
    release: () => {
      if (released) return;

      released = true;
      request.subscribers = Math.max(0, request.subscribers - 1);

      window.setTimeout(() => {
        if (request.subscribers === 0 && activeCategoryRequest === request) {
          request.controller.abort();
          activeCategoryRequest = null;
        }
      }, 0);
    },
  };
}

export function useStockCategoryOptions(enabled: boolean) {
  const [categoryOptions, setCategoryOptions] = React.useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(false);
  const [categoriesError, setCategoriesError] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    if (!enabled) return;

    let isSubscribed = true;
    const request = subscribeToCategoryRequest();

    setIsLoadingCategories(true);
    setCategoriesError(null);

    request.promise
      .then((categories) => {
        if (!isSubscribed) return;

        setCategoryOptions(categories);
      })
      .catch(() => {
        if (!isSubscribed) return;

        setCategoryOptions([]);
        setCategoriesError(
          "Não foi possível carregar as categorias. Você ainda pode criar uma nova.",
        );
      })
      .finally(() => {
        if (!isSubscribed) return;

        setIsLoadingCategories(false);
      });

    return () => {
      isSubscribed = false;
      request.release();
    };
  }, [enabled]);

  return {
    categoryOptions,
    isLoadingCategories,
    categoriesError,
  };
}
