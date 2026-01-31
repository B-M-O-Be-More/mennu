"use client";

import { Stack } from "@mui/material";
import { FormResetPassword } from "@/components/Forms/FormResetPassword";

function ResetPasswordPage() {
    return( 
    <Stack  width={"full"}
      height="100vh"
      bgcolor={"background.auth"}
      justifyContent="center"
      alignItems="center"
      padding={"10px"}>
        <FormResetPassword/>     
    </Stack>
    );
}

export default ResetPasswordPage;