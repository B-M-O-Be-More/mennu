export interface IProfilePermissions {
  id: number;
  nome: string;
  descricao: string;
  usuarios: string[];
  criadoEm: string;
  permissoes: IProfilePermissionsItems[];
}

export interface IProfilePermissionsItems {
  modulo: string;
  visualizar: boolean;
  criar: boolean;
  editar: boolean;
  excluir: boolean;
}
