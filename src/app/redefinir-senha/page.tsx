"use client";

import { useState } from "react";
import { Box, Typography, CircularProgress, Button, Card, CardContent } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; 
import { useRouter } from "next/navigation";
import Link from "next/link"; 


import { useValidarToken, useRedefinirSenha } from "@/hooks/usePasswordReset/hook";

import { FormNewPassword } from "@/components/Forms/FormNewPassword/component";
import { Suspense } from "react";

function RedefinirSenhaContent() {
  const router = useRouter();
  
  const { data, isLoading: isValidating, error, token } = useValidarToken();
  const { mutateAsync: redefinirSenha, isLoading: isSubmitting } = useRedefinirSenha();

  
  const [sucesso, setSucesso] = useState(false);

  const handleFinalSubmit = async (novaSenha: string, confirmarSenha: string) => {
    if (token) {
      try {
        await redefinirSenha({
          token,
          nova_senha: novaSenha,
          confirmar_senha: confirmarSenha,
        });
        
        setSucesso(true);
      } catch (err) {
        console.error(err);
        
      }
    }
  };

  if (isValidating) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#D63B0F', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Box sx={{ bgcolor: '#FFFFFF', borderRadius: '16px', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 480, width: '100%' }}>
          <CircularProgress sx={{ color: '#D63B0F', mb: 2 }} />
          <Typography fontWeight={500}>Validando link de recuperação...</Typography>
        </Box>
      </Box>
    );
  }

  if (error || !data?.valido) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#D63B0F', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Box sx={{ bgcolor: '#FFFFFF', borderRadius: '16px', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <ErrorOutlineIcon sx={{ fontSize: 64, color: '#D63B0F', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} sx={{ color: '#111827', mb: 1 }}>Link Inválido</Typography>
          <Typography sx={{ color: '#6B7280', mb: 4 }}>Este link de recuperação expirou ou é inválido. Por favor, solicite uma nova redefinição de senha.</Typography>
          <Button
            fullWidth
            variant="contained"
            onClick={() => router.push('/passwordreset')}
            sx={{ bgcolor: '#D63B0F', color: '#fff', fontWeight: 600, py: 1.5, borderRadius: '10px', textTransform: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#B83409', boxShadow: 'none' } }}
          >
            Voltar para Recuperação
          </Button>
        </Box>
      </Box>
    );
  }

 
  if (sucesso) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#D63B0F', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Card
          elevation={4}
          sx={{
            width: '100%',
            maxWidth: 380,
            borderRadius: 4,
            px: 2,
            py: 1,
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)", 
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              textAlign: 'center',
              pt: 4,
              pb: 4,
            }}
          >
            {}
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#EDFBF1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircleOutlineIcon sx={{ color: '#2ECC71', fontSize: 32 }} />
            </Box>

            {}
            <Typography
              variant="h5"
              fontWeight={700}
              color="text.primary"
              lineHeight={1.3}
            >
              Senha redefinida com sucesso
            </Typography>

            {}
            <Typography variant="body2" color="text.secondary">
              Você já pode entrar novamente.
            </Typography>

            {}
            <Button
              component={Link}
              href="/" 
              variant="contained"
              fullWidth
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: 2,
                backgroundColor: '#D63B0F',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: "none",
                '&:hover': {
                  backgroundColor: '#B83409',
                  boxShadow: "none",
                },
              }}
            >
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        bgcolor: '#D63B0F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <FormNewPassword 
        emailMascarado={data.email_mascarado} 
        onSubmit={handleFinalSubmit}
        loading={isSubmitting}
      />
    </Box>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: '100vh', bgcolor: '#D63B0F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#FFFFFF' }} />
      </Box>
    }>
      <RedefinirSenhaContent />
    </Suspense>
  );
}