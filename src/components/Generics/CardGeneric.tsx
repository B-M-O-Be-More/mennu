import { Stack, StackProps } from "@mui/material";
import { forwardRef } from "react";
import NextLink from "next/link";

interface CardGenericProps extends StackProps {
	component?: typeof NextLink | "div" | "span";
	href?: string;
}

export const CardGeneric = forwardRef<HTMLDivElement, CardGenericProps>(
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

CardGeneric.displayName = "CardGeneric";

export default CardGeneric;
