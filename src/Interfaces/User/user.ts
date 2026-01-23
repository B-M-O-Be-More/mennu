export interface User {
  id: number;
  nome: string;
  email: string;
  cpf?: string;
  tipo_usuario: string;
  status: boolean;
  status_acesso: boolean;
  updated_at: string;
  token_access: {
    token: string;
    expirado_em: string;
  };
}
