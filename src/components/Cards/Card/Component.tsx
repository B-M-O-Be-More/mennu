import { Stack } from "@mui/material";
import { forwardRef } from "react";
import { CardProps } from "./";

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, sx, ...rest }, ref) => {
    return (
      <Stack
        ref={ref}
        border="1px solid"
        borderColor="divider"
        borderRadius={3}
        bgcolor="background.paper"
        padding={3}
        spacing={2}
        sx={{ flex: 1, ...sx }}
        minWidth={"fit-content"}
        {...rest}
      >
        {children}
      </Stack>
    );
  }
);

Card.displayName = "Card";

export default Card;
