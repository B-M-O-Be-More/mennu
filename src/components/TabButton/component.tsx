import { Button } from "@mui/material";
import { TabButtonProps } from "./interface";

export function TabButton({
  label,
  icon,
  tabIndex,
  activeTab,
  onChange,
}: TabButtonProps) {
  const isActive = activeTab === tabIndex;

  return (
    <Button
      variant={isActive ? "contained" : "outlined"}
      onClick={() => onChange(tabIndex)}
      startIcon={icon}
      sx={{
        transition: "all .4s ease-in-out",
        color: isActive ? "" : "text.secondary",
      }}>
      {label}
    </Button>
  );
}
