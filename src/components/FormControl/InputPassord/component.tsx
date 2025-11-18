"use client";

import { InputProps } from "./interface";
import { Input, Field, Icon, InputGroup, Text } from "@chakra-ui/react";
import React from "react";
import { LuEye, LuEyeClosed } from "@/components/Icons";

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
  const [show, setShow] = React.useState(false);

  const verifyIcon = () => {
    return show ? (
      <LuEye color={"black"} size={"24px"} onClick={() => setShow(!show)} />
    ) : (
      <LuEyeClosed color={"black"} size={"24px"} onClick={() => setShow(!show)} />
    );
  };

  return (
    <Field.Root invalid={!!error} disabled={isDisabled}>
      {label && (
        <Field.Label htmlFor={name}>
          <Text px="1">{label}</Text>
        </Field.Label>
      )}

      <InputGroup color={"black"} endElement={verifyIcon()}>
        <Input
          bg={"#EFEFEF"}
          ref={ref}
          name={name}
          id={name}
          type={show ? "text" : "password"}
          size="lg"
          autoComplete="off"
          {...rest}
        />
      </InputGroup>

      {!!error && <Field.ErrorText>{error.message}</Field.ErrorText>}
    </Field.Root>
  );
}

export const InputPassword = React.forwardRef(InputBase);
