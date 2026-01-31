export interface IUser {
  id: number;
  nome: string;
  email: string;
  cpf?: string;
  matricula: string;
  tipo_usuario: "administrador" | "gestor" | "funcionario";
  status: boolean;
  status_acesso: boolean;
  numero_cartao: string;
  unidade: string;
  updated_at: string;
  token_access: {
    token: string;
    expirado_em: string;
  };
  ultima_refeicao: string | null;
}
