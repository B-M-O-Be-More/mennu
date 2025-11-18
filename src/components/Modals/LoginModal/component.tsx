"use client";

import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { LoginModalComponentProps } from "./interface";
import { LuLogIn } from "@/components/Icons";
import FormLoginComponent from "@/components/Forms/Login";
import { useTranslation } from "react-i18next";

export default function LoginModal({}: LoginModalComponentProps) {
  const { t } = useTranslation();

  return (
    <Dialog.Root placement="center" motionPreset="slide-in-bottom">
      <Dialog.Trigger asChild>
        <Button variant="outline">
          <LuLogIn />
          {t("LoginModal.login")}
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{t("LoginModal.login")}</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>
              <FormLoginComponent />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
