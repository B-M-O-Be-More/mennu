"use client";

import { Stack, Typography } from "@mui/material";
import { FormResetPassword } from "@/components/Forms/FormResetPasswrod";

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