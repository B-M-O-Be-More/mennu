"use client";

import { InputProps } from "./interface";
import {
  Input as ChakraInput,
  Field,
  InputGroup,
  Text,
} from "@chakra-ui/react";
import React from "react";

function InputBase(
  {
    name,
    label,
    type = "text",
    error = null,
    isDisabled = false,
    ...rest
  }: InputProps,
  ref: React.Ref<HTMLInputElement>
) {
  return (
    <Field.Root invalid={!!error} disabled={isDisabled}>
      {label && (
        <Field.Label htmlFor={name}>
          <Text px="1">{label}</Text>
        </Field.Label>
      )}

      <InputGroup color={"black"}>
        <ChakraInput
          bg={"#EFEFEF"}
          ref={ref}
          name={name}
          id={name}
          type={type}
          size="lg"
          autoComplete="off"
          {...rest}
        />
      </InputGroup>

      {!!error && <Field.ErrorText>{error.message}</Field.ErrorText>}
    </Field.Root>
  );
}

export const Input = React.forwardRef(InputBase);
