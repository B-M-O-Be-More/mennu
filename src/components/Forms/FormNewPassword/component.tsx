'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface PasswordRequirement {
  label: string;
  test: (value: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  { label: 'Mínimo de 8 caracteres', test: (v) => v.length >= 8 },
  { label: 'Pelo menos uma letra maiúscula', test: (v) => /[A-Z]/.test(v) },
  { label: 'Pelo menos uma letra minúscula', test: (v) => /[a-z]/.test(v) },
  { label: 'Pelo menos um número', test: (v) => /[0-9]/.test(v) },
  { label: 'Pelo menos um caractere especial (!@#$%^&*)', test: (v) => /[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\;\:\'\"\,\.\<\>\/\?\|\\`\~]/.test(v) },
];

interface Props {
  emailMascarado: string;
  onSubmit: (nova: string, confirma: string) => Promise<void>;
  loading: boolean;
}

export function FormNewPassword({ emailMascarado, onSubmit, loading }: Props) {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showNova, setShowNova] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const todasRegrasAtendidas = requirements.every((req) => req.test(novaSenha));
  const senhasCoincidem = novaSenha === confirmarSenha && novaSenha.length > 0;

  const novaSenhaError = submitted && !todasRegrasAtendidas;
  const confirmarSenhaError = submitted && !senhasCoincidem;

  const handleSubmit = async () => {
    setSubmitted(true);
    if (todasRegrasAtendidas && senhasCoincidem) {
      await onSubmit(novaSenha, confirmarSenha);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: '16px',
        p: { xs: 3, sm: 4 },
        width: '100%',
        maxWidth: 480,
      }}
    >
      {/* Back link */}
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

      {/* Lock icon */}
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

      {/* Title */}
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, textAlign: 'center', mb: 1, color: '#111827' }}
      >
        Redefinir Senha
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body2"
        sx={{ textAlign: 'center', color: '#6B7280', mb: 3 }}
      >
        Criando uma nova senha para <strong>{emailMascarado}</strong>
      </Typography>

      {/* Nova Senha */}
      <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.75, color: '#111827' }}>
        Nova Senha
      </Typography>
      <TextField
        fullWidth
        type={showNova ? 'text' : 'password'}
        value={novaSenha}
        onChange={(e) => setNovaSenha(e.target.value)}
        error={novaSenhaError}
        placeholder="Nova senha"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowNova((v) => !v)} edge="end" size="small">
                {showNova ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          mb: novaSenhaError ? 0.5 : 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '& fieldset': { borderColor: novaSenhaError ? '#D63B0F' : '#E5E7EB' },
            '&:hover fieldset': { borderColor: novaSenhaError ? '#D63B0F' : '#9CA3AF' },
            '&.Mui-focused fieldset': { borderColor: novaSenhaError ? '#D63B0F' : '#7C3AED' },
          },
        }}
      />

      {novaSenhaError && (
        <Typography variant="caption" sx={{ color: '#D63B0F', mb: 2, display: 'block' }}>
          A senha não atende a todos os requisitos de segurança.
        </Typography>
      )}

      {/* Confirmar Nova Senha */}
      <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.75, color: '#111827' }}>
        Confirmar Nova Senha
      </Typography>
      <TextField
        fullWidth
        type={showConfirmar ? 'text' : 'password'}
        value={confirmarSenha}
        onChange={(e) => setConfirmarSenha(e.target.value)}
        error={confirmarSenhaError}
        placeholder="Confirmar nova senha"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConfirmar((v) => !v)} edge="end" size="small">
                {showConfirmar ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          mb: confirmarSenhaError ? 0.5 : 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '& fieldset': { borderColor: confirmarSenhaError ? '#D63B0F' : '#E5E7EB' },
            '&:hover fieldset': { borderColor: confirmarSenhaError ? '#D63B0F' : '#9CA3AF' },
            '&.Mui-focused fieldset': { borderColor: confirmarSenhaError ? '#D63B0F' : '#7C3AED' },
          },
        }}
      />

      {confirmarSenhaError && (
        <Typography variant="caption" sx={{ color: '#D63B0F', mb: 2, display: 'block' }}>
          As senhas não coincidem
        </Typography>
      )}

      {/* Password requirements box */}
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
          const met = novaSenha.length > 0 && req.test(novaSenha);
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

      {/* Submit button */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
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
          '&:hover': {
            bgcolor: '#B83409',
            boxShadow: 'none',
          },
          '&:active': {
            bgcolor: '#9C2D07',
          },
          '&.Mui-disabled': {
             bgcolor: '#FCA5A5', 
             color: '#fff' 
          }
        }}
      >
        {loading ? 'Redefinindo...' : 'Redefinir Senha'}
      </Button>
    </Box>
  );
}