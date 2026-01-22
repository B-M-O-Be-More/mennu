export interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  tabIndex: number;
  activeTab: number;
  onChange: (index: number) => void;
}
