import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import NextLink from "next/link";
import { CardGeneric } from "../Generics";
import { IconBox } from "./index";

interface ModuleCardProps {
	icon: ReactNode;
	iconBgColor: string;
	title: string;
	subtitle: string;
	link: string;
}

export default function ModuleCard({
	icon,
	iconBgColor,
	title,
	subtitle,
	link,
}: ModuleCardProps) {
	return (
		<CardGeneric
			component={NextLink}
			href={link}
			sx={{
				cursor: "pointer",
				textDecoration: "none",
				transition: "all 0.2s ease-in-out",
				"&:hover": {
					boxShadow: 3,
					transform: "translateY(-2px)",
				},
			}}
		>
			<IconBox
				icon={icon}
				bgColor={iconBgColor}
				padding={2}
				borderRadius={3}
			/>
			<Box component="span">
				<Typography fontSize="20px" fontWeight="400" color="#0A0A0A">
					{title}
				</Typography>

				<Typography fontSize="18px" fontWeight="400" color="#6A7282">
					{subtitle}
				</Typography>
			</Box>
		</CardGeneric>
	);
}
