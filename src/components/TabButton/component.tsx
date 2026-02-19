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
      size="medium"
      sx={{
        transition: "all .4s ease-in-out",
        color: isActive ? "" : "text.secondary",
        bgcolor: isActive ? "" : "background.paper",
        maxHeight: "3rem",
        padding: "1rem",
        fontSize: { xs: "0.675rem", sm: "0.75rem", lg: "0.875rem" },
      }}>
      {label}
    </Button>
  );
}
