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
        bgcolor: isActive ? "" : "#fff",
        maxHeight: "3.75rem",
        padding: "1.5rem",
        fontSize: { xs: "0.7rem", sm: "0.8rem", lg: "0.9rem" },
      }}>
      {label}
    </Button>
  );
}
