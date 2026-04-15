// Tipos de Entrada (Requests)
export interface EsqueciSenhaIn {
  email: string;
}

export interface RedefinirSenhaIn {
  token: string;
  nova_senha: string;
  confirmar_senha: string;
}

// Tipos de Saída (Responses)
export interface MessageSchema {
  detail: string;
}

export interface ValidarTokenOut {
  valido: boolean;
  email_mascarado: string;
}