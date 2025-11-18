import { InputProps as ChakraInputProps } from "@chakra-ui/react";
import { FieldError } from "react-hook-form";

export interface InputProps extends ChakraInputProps {
  label?: string;
  bgLabel?: string;
  error?: FieldError | null | undefined;
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: React.ReactNode;
  newStyle?: boolean;
}
