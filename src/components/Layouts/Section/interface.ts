import { StackProps } from "@chakra-ui/react";
import { ReactNode } from "react";

export interface SectionComponentProps extends StackProps {
  children: ReactNode;
}
