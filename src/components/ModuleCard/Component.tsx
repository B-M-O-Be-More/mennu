import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import NextLink from "next/link";
import Card from "../Cards/Card";
import IconBox from "../Cards/IconBox";

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
    <Card
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
        <Typography variant="body1" fontWeight="400" color="text.primary">
          {title}
        </Typography>

        <Typography variant="body2" fontWeight="400" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
    </Card>
  );
}
