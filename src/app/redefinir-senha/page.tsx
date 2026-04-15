"use client";

import { Box, Typography, CircularProgress, Button } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useRouter } from "next/navigation";

// Hooks
import { useValidarToken, useRedefinirSenha } from "@/hooks/usePasswordReset/hook";

import { FormNewPassword } from "@/components/Forms/FormNewPassword/component";

export default function RedefinirSenhaPage() {
  const router = useRouter();
  
  const { data, isLoading: isValidating, error, token } = useValidarToken();
  const { mutateAsync: redefinirSenha, isLoading: isSubmitting } = useRedefinirSenha();

  const handleFinalSubmit = async (novaSenha: string, confirmarSenha: string) => {
    if (token) {
      await redefinirSenha({
        token,
        nova_senha: novaSenha,
        confirmar_senha: confirmarSenha,
      });
    }
  };

  // 1. Estado de Carregamento Inicial (Validando Token)
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

  // 2. Estado de Erro (Token Inválido ou Expirado)
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

  // 3. Sucesso: Componente Principal
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