'use client';

import { signIn, getProviders, ClientSafeProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Button,
  Alert,
} from '@mui/material';
import { Google } from '@mui/icons-material';

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();

    // Check for error in URL
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam === 'AccessDenied') {
      setError('Access denied. Only @grastontechnique.com email addresses are allowed.');
    }
  }, []);

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Graston Guide Dashboard
          </Typography>
          
          <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 3 }}>
            Sign in with your @grastontechnique.com Google account to access the dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          {providers && Object.values(providers).map((provider: ClientSafeProvider) => (
            <Button
              key={provider.name}
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Google />}
              onClick={() => signIn(provider.id)}
              sx={{ mt: 2 }}
            >
              Sign in with {provider.name}
            </Button>
          ))}
        </Paper>
      </Box>
    </Container>
  );
}