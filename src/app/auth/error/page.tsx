'use client';

import { useSearchParams } from 'next/navigation';
import { Container, Paper, Box, Typography, Button, Alert } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import Link from 'next/link';
import { Suspense } from 'react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'AccessDenied':
        return 'Access denied. Only @grastontechnique.com email addresses are allowed.';
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      default:
        return 'An error occurred during authentication.';
    }
  };

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
          <ErrorIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          
          <Typography component="h1" variant="h4" gutterBottom>
            Authentication Error
          </Typography>

          <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
            {getErrorMessage(error)}
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button
              component={Link}
              href="/auth/signin"
              variant="contained"
              color="primary"
            >
              Try Again
            </Button>
            
            <Button
              component={Link}
              href="/"
              variant="outlined"
            >
              Go Home
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <Container component="main" maxWidth="sm">
        <Box sx={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    }>
      <ErrorContent />
    </Suspense>
  );
}