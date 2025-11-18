"use client";

import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { RegisterModalComponentProps } from "./interface";
import { LuUserPlus } from "@/components/Icons";
import FormRegisterComponent from "@/components/Forms/Register";
import { useTranslation } from "react-i18next";

export default function RegisterModal({}: RegisterModalComponentProps) {
  const { t } = useTranslation();
  return (
    <Dialog.Root placement="center" motionPreset="slide-in-bottom">
      <Dialog.Trigger asChild>
        <Button>
          <LuUserPlus />
          {t("RegisterModal.register")}
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{t("RegisterModal.register")}</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>
              <FormRegisterComponent />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
