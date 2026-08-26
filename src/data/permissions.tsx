import { IProfilePermissionsItems } from "@/Interfaces/ProfilePermissions/profilePermissions";

const modulos: { modulo: string; label: string }[] = [
  { modulo: "dashboard", label: "Dashboard" },
  { modulo: "cardapios", label: "Cardápios" },
  { modulo: "estoque", label: "Estoque" },
  { modulo: "refeicoes", label: "Refeições" },
  { modulo: "relatorios", label: "Relatórios" },
  { modulo: "usuarios", label: "Usuários" },
  { modulo: "terminal", label: "Terminal" },
  { modulo: "configuracoes", label: "Configurações" },
  { modulo: "perfis_permissoes", label: "Perfis & Permissões" },
  { modulo: "logs_auditoria", label: "Logs & Auditoria" },
  { modulo: "auditoria_estoque", label: "Auditoria de Estoque" },
];

export const defaultModulePermissions: IProfilePermissionsItems[] = modulos.map(
  ({ modulo, label }) => ({
    modulo,
    label,
    visualizar: false,
    criar: false,
    editar: false,
    excluir: false,
  }),
);
