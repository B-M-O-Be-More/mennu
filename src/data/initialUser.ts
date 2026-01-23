import { User } from "@/Interfaces/User/user";

export function initialUser(): User {
  return {
    id: 0,
    nome: "",
    email: "",
    cpf: "",
    tipo_usuario: "assinate",
    token_access: {
      token: "",
      expirado_em: "",
    },
    status: false,

    status_acesso: false,
    updated_at: "",
  };
}