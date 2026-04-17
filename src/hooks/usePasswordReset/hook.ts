import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; 
import { EsqueciSenhaIn, MessageSchema, RedefinirSenhaIn, ValidarTokenOut } from '@/Interfaces/Auth/passwordReset';

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

      const body = await response.json();
      
      if (!response.ok) {
        throw new Error(body.detail || 'Erro na requisição');
      }

      return body as MessageSchema;
    } catch (err: unknown) { 
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao solicitar recuperação';
      
      setError(errorMessage);
      alert(errorMessage);
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
        const body = await response.json();

        if (!response.ok) {
          throw new Error(body.detail || 'Erro ao validar token');
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

      const body = await response.json();
      
      if (!response.ok) {
        throw new Error(body.detail || 'Erro ao redefinir senha');
      }

      return body as MessageSchema;
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