import { Box } from "@mui/material";
import { ReactNode } from "react";

interface IconBoxProps {
	icon: ReactNode;
	bgColor?: string;
	padding?: number | string;
	borderRadius?: number | string;
	maxWidth?: string;
}

export default function IconBox({
	icon,
	bgColor = "#EFF6FF",
	padding = 2,
	borderRadius = 3,
	maxWidth = "fit-content",
}: IconBoxProps) {
	return (
		<Box
			component="span"
			padding={padding}
			bgcolor={bgColor}
			borderRadius={borderRadius}
			maxWidth={maxWidth}
			sx={{ display: "inline-flex" }}
		>
			{icon}
		</Box>
	);
}
