"use client";

import { Button, Stack } from "@chakra-ui/react";
import { FormLoginComponentProps } from "./interface";
import { useTranslation } from "react-i18next";
import Input from "@/components/FormControl/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchemaType, loginSchema } from "@/schemas/loginSchema";
import { InputPassword } from "@/components/FormControl/InputPassord/component";

export default function FormLoginComponent({}: FormLoginComponentProps) {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const handleLogin = (data: LoginSchemaType) => {
    console.log(data);
  };

  return (
    <Stack gap={6} as={"form"} onSubmit={handleSubmit(handleLogin)}>
      <Stack>
        <Input error={errors.email} label={t("LoginModal.email")} {...register("email")} />
        <InputPassword
          error={errors.password}
          label={t("LoginModal.password")}
          {...register("password")}
        />
      </Stack>
      <Button type="submit" borderRadius={"md"}>
        {t("LoginModal.login")}
      </Button>
    </Stack>
  );
}
