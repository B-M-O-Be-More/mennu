import { IProfilePermissions } from "@/Interfaces/ProfilePermissions/profilePermissions";

export const profilePermissionsMock: IProfilePermissions[] = [
  {
    id: 0,
    nome: "Vazio",
    descricao: "Perfil sem acesso.",
    usuarios: [],
    criadoEm: "15/11/2025",
    permissoes: [
      {
        modulo: "Dashboard",
        visualizar: false,
        criar: false,
        editar: false,
        excluir: false,
      },
      {
        modulo: "Relatórios",
        visualizar: false,
        criar: false,
        editar: false,
        excluir: false,
      },
      {
        modulo: "Configurações",
        visualizar: false,
        criar: false,
        editar: false,
        excluir: false,
      },
      {
        modulo: "Usuários",
        visualizar: false,
        criar: false,
        editar: false,
        excluir: false,
      },
      {
        modulo: "Permissões",
        visualizar: false,
        criar: false,
        editar: false,
        excluir: false,
      },
      {
        modulo: "Perfil de Acesso",
        visualizar: false,
        criar: false,
        editar: false,
        excluir: false,
      }
    ]
  },
  {
    id: 1,
    nome: "Administrador",
    descricao: "Perfil com acesso total a todas as funcionalidades do sistema.",
    usuarios: ["João Silva", "Maria Oliveira"],
    criadoEm: "15/11/2025",
    permissoes: [
      {
        modulo: "Dashboard",
        visualizar: true,
        criar: false,
        editar: false,
        excluir: false,
      },
      {
        modulo: "Relatórios",
        visualizar: true,
        criar: true,
        editar: false,
        excluir: false,
      },
      {
        modulo: "Configurações",
        visualizar: true,
        criar: true,
        editar: true,
        excluir: false,
      },
      {
        modulo: "Usuários",
        visualizar: true,
        criar: true,
        editar: true,
        excluir: true,
      },
      {
        modulo: "Permissões",
        visualizar: true,
        criar: true,
        editar: true,
        excluir: true,
      },
      {
        modulo: "Perfil de Acesso",
        visualizar: true,
        criar: true,
        editar: true,
        excluir: true,
      }
    ]
  },
  {
    id: 2,
    nome: "Gerente",
    descricao: "Perfil com acesso a funcionalidades de gerenciamento e relatórios.",
    usuarios: ["Carlos Souza", "Ana Costa"],
    criadoEm: "20/11/2025",
    permissoes: [
      {
        modulo: "Dashboard",
        visualizar: true,
        criar: false,
        editar: false,
        excluir: false,
      },
      {
        modulo: "Relatórios",
        visualizar: true,
        criar: true,
        editar: false,
        excluir: false,
      },
      {
        modulo: "Configurações",
        visualizar: true,
        criar: false,
        editar: false,
        excluir: false,
      },
      {
        modulo: "Usuários",
        visualizar: true,
        criar: true,
        editar: true,
        excluir: false,
      },
      {
        modulo: "Permissões",
        visualizar: true,
        criar: false,
        editar: false,
        excluir: false,
      },
      {
        modulo: "Perfil de Acesso ",
        visualizar: true,
        criar: false,
        editar: false,
        excluir: false,
      }
    ]
  },
  {
    id: 3,
    nome: "Funcionário",
    descricao: "Perfil com acesso limitado a funcionalidades específicas para funcionários.",
    usuarios: ["Pedro Santos", "Mariana Almeida"],
    criadoEm: "25/11/2025",
    permissoes: [
      {
        modulo: "Dashboard",
        visualizar: true,
        criar: false,
        editar: false,
        excluir: false,
      },
      {
        modulo: "Relatórios",
        visualizar: true,
        criar: false,
        editar: false,
        excluir: false,
      },
      {
        modulo: "Configurações",
        visualizar: false,
        criar: false,
        editar: false,
        excluir: false,
      },
      {
        modulo: "Usuários",
        visualizar: false,
        criar: false,
        editar: false,
        excluir: false,
      },
      {
        modulo: "Permissões",
        visualizar: false,
        criar: false,
        editar: false,
        excluir: false,
      },
      {
        modulo: "Perfil de Acesso",
        visualizar: false,
        criar: false,
        editar: false,
        excluir: false,
      }
    ]
  }
];
