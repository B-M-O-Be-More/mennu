'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import * as yup from 'yup';

import Input from '@/components/FormControl/Input';
import { newPasswordSchema } from '@/schemas/resetSchema';

interface Props {
  emailMascarado: string;
  onSubmit: (nova: string, confirma: string) => Promise<void>;
  loading: boolean;
}

export function FormNewPassword({ emailMascarado, onSubmit, loading }: Props) {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  
  const requirements = useMemo(() => [
    { label: 'Mínimo de 8 caracteres', test: (v: string) => v.length >= 8 },
    { label: 'Pelo menos uma letra maiúscula', test: (v: string) => /[A-Z]/.test(v) },
    { label: 'Pelo menos uma letra minúscula', test: (v: string) => /[a-z]/.test(v) },
    { label: 'Pelo menos um número', test: (v: string) => /[0-9]/.test(v) },
    {
      label: 'Pelo menos um caractere especial (!@#$%^&*)',
      test: (v: string) => /[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\;\:\'\"\,\.\<\>\/\?\|\\`\~]/.test(v),
    },
  ], []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setErrors({});

    try {
      
      await newPasswordSchema.validate(
        { nova_senha: novaSenha, confirmar_senha: confirmarSenha },
        { abortEarly: false }
      );
      
      await onSubmit(novaSenha, confirmarSenha);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: '16px',
        p: { xs: 3, sm: 4 },
        width: '100%',
        maxWidth: 480,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.primary' }}>
            <ArrowBackIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              Voltar ao login
            </Typography>
          </Box>
        </Link>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: '#F3F0FB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 32, color: '#7C3AED' }} />
        </Box>
      </Box>

      <Typography
        variant="h4"
        sx={{ fontWeight: 700, textAlign: 'center', mb: 1, color: '#111827' }}
      >
        Redefinir Senha
      </Typography>

      <Typography variant="body2" sx={{ textAlign: 'center', color: '#6B7280', mb: 3 }}>
        Criando uma nova senha para <strong>{emailMascarado}</strong>
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Input
          label="Nova Senha"
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          error={submitted ? errors.nova_senha : undefined}
          optional={false}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Input
          label="Confirmar Nova Senha"
          type="password"
          placeholder="Confirmar nova senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          error={submitted ? errors.confirmar_senha : undefined}
          optional={false}
        />
      </Box>

      <Box
        sx={{
          bgcolor: '#F9FAFB',
          borderRadius: '10px',
          p: 2,
          mb: 3,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: '#111827' }}>
          Requisitos da Senha:
        </Typography>
        {requirements.map((req) => {
          const met = req.test(novaSenha);
          return (
            <Typography
              key={req.label}
              variant="body2"
              sx={{
                color: met ? '#16A34A' : '#374151',
                mb: 0.5,
                '&:last-child': { mb: 0 },
              }}
            >
              • {req.label}
            </Typography>
          );
        })}
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          bgcolor: '#D63B0F',
          color: '#fff',
          fontWeight: 600,
          fontSize: '1rem',
          py: 1.75,
          borderRadius: '10px',
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': { bgcolor: '#B83409', boxShadow: 'none' },
          '&.Mui-disabled': { bgcolor: '#FCA5A5', color: '#fff' },
        }}
      >
        {loading ? 'Redefinindo...' : 'Redefinir Senha'}
      </Button>
    </Box>
  );
}