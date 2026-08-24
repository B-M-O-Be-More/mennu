import { IProfilePermissionsItems } from "@/Interfaces/ProfilePermissions/profilePermissions";

export interface IUser {
  id: number;
  nome: string;
  email: string;
  cpf?: string;
  matricula: string;
  tipo_usuario: "admin" | "gestor" | "funcionario";
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
  permissoes?: IProfilePermissionsItems[];
}

export interface IUsuarioListItem {
  id: number;
  nome: string | null;
  documento: string;
  matricula: string | null;
  categoria_usuario: string;
  is_active: boolean;
  criado_em: string;
  unidade: { id: number; nome: string };
  numero_cartao: string | null;
}
