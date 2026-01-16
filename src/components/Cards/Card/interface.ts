import { StackProps } from "@mui/material";
import NextLink from "next/link";

export interface CardProps extends StackProps {
  component?: typeof NextLink | "div" | "span";
  href?: string;
}