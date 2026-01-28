import { Stack } from "@mui/material";
import { forwardRef } from "react";
import { CardProps } from "./";

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, sx, variant = "default", ...rest }, ref) => {
    const isCompact = variant === "compact";
    return (
      <Stack
        ref={ref}
        border="1px solid"
        borderColor="divider"
        borderRadius={3}
        bgcolor="background.paper"
        padding={isCompact ? 1 : 3}
        spacing={isCompact ? 1 : 2}
        minWidth={"fit-content"}
        sx={{
          flex: isCompact ? "unset" : 1,
          display: isCompact ? "block" : "flex",
          width: isCompact ? "100%" : "auto",
          maxWidth: isCompact ? "30%" : "auto",
          ...sx,
        }}
        {...rest}>
        {children}
      </Stack>
    );
  },
);

Card.displayName = "Card";

export default Card;
