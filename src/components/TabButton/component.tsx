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
        fontSize: { xs: "0.7rem", sm: "0.8rem", lg: "0.9rem" },
        borderRadius: 3,
      }}
    >
      {label}
    </Button>
  );
}
