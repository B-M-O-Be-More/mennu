import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EsqueciSenhaIn, MessageSchema, RedefinirSenhaIn, ValidarTokenOut } from '@/Interfaces/Auth/passwordReset';

type ApiPayload = Record<string, unknown> | null;

async function readResponseBody(response: Response): Promise<ApiPayload> {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as Record<string, unknown>;
  }

  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  return { message: text };
}

function getErrorMessage(body: ApiPayload, fallback: string) {
  if (!body) {
    return fallback;
  }

  if (typeof body.detail === 'string' && body.detail.trim()) {
    return body.detail;
  }

  if (typeof body.message === 'string' && body.message.trim()) {
    return body.message;
  }

  return fallback;
}

export function useSolicitarRecuperacao() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = useCallback(async (data: EsqueciSenhaIn) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/esqueci-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const body = await readResponseBody(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(body, 'Erro na requisição'));
      }

      return (body ?? {
        detail: 'Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.',
      }) as MessageSchema;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao solicitar recuperação';

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutateAsync, isLoading, error };
}

export function useValidarToken() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ValidarTokenOut | null>(null);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const validate = async () => {
      try {
        const queryString = new URLSearchParams({ token }).toString();
        const response = await fetch(`/api/auth/validar-token-redefinicao?${queryString}`);
        const body = await readResponseBody(response);

        if (!response.ok) {
          throw new Error(getErrorMessage(body, 'Erro ao validar token'));
        }

        if (isMounted) {
          setData(body as ValidarTokenOut);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao validar token';
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    validate();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return { data, isLoading, error, token };
}

export function useRedefinirSenha() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = useCallback(async (data: RedefinirSenhaIn) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/redefinir-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const body = await readResponseBody(response);

      if (!response.ok) {
        throw new Error(getErrorMessage(body, 'Erro ao redefinir senha'));
      }

      return (body ?? {
        detail: 'Senha redefinida com sucesso.',
      }) as MessageSchema;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao redefinir senha';

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutateAsync, isLoading, error };
}
