"use client";

import { Stack } from "@mui/material";
import { FormResetPassword } from "@/components/Forms/FormResetPassword";
import { useSolicitarRecuperacao } from "@/hooks/usePasswordReset/hook";

function ResetPasswordPage() {
    const { mutateAsync: solicitarRecuperacao } = useSolicitarRecuperacao();

    const handleSubmit = async (email: string) => {
      
      await solicitarRecuperacao({ email });
    };

    return( 
    <Stack  width={"full"}
      height="100vh"
      bgcolor={"background.auth"}
      justifyContent="center"
      alignItems="center"
      padding={"10px"}>
        <FormResetPassword onSubmit={handleSubmit} />     
    </Stack>
    );
}

export default ResetPasswordPage;