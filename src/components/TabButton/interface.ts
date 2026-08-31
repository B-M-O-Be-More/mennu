export interface TabButtonProps {
  label: string;
  /** Opcional: as abas de Auditoria/Histórico do estoque não usam ícone. */
  icon?: React.ReactNode;
  tabIndex: number;
  activeTab: number;
  onChange: (index: number) => void;
}
