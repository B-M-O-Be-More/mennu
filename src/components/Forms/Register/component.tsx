"use client";

import { Button, SimpleGrid, Stack } from "@chakra-ui/react";
import { FormRegisterComponentProps } from "./interface";
import { useTranslation } from "react-i18next";
import Input from "@/components/FormControl/Input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterSchemaType, registerSchema } from "@/schemas/registerSchema";
import { InputPassword } from "@/components/FormControl/InputPassord/component";

export default function FormRegisterComponent({}: FormRegisterComponentProps) {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const handleRegister = (data: RegisterSchemaType) => {
    console.log(data);
  };

  return (
    <Stack gap={6} as={"form"} onSubmit={handleSubmit(handleRegister)}>
      <Stack>
        <Input
          error={errors.name}
          label={t("RegisterModal.name")}
          {...register("name")}
        />
        <Input
          error={errors.email}
          label={t("RegisterModal.email")}
          {...register("email")}
        />
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={2}>
          <Input
            error={errors.birthdate}
            label={t("RegisterModal.birthdate")}
            {...register("birthdate")}
          />
          <Input
            error={errors.document}
            label={t("RegisterModal.document")}
            {...register("document")}
          />
        </SimpleGrid>
        <Input
          error={errors.phone}
          label={t("RegisterModal.phone")}
          {...register("phone")}
        />
        <InputPassword
          error={errors.password}
          label={t("RegisterModal.password")}
          {...register("password")}
        />
      </Stack>
      <Button type="submit" borderRadius={"md"}>
        {t("RegisterModal.register")}
      </Button>
    </Stack>
  );
}
