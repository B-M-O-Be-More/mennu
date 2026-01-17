import { Box } from "@mui/material";
import { IconBoxProps } from "./";

export default function IconBox({
  icon,
  bgColor = "#EFF6FF",
  padding = 2,
  borderRadius = 3,
  maxWidth = "fit-content",
  maxHeight = "fit-content",
  sx = {}
}: IconBoxProps) {
  return (
    <Box
      component="span"
      padding={padding}
      bgcolor={bgColor}
      borderRadius={borderRadius}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      sx={{ display: "inline-flex", ...sx }}
    >
      {icon}
    </Box>
  );
}
