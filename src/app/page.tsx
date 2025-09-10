'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { Event, Dashboard, People } from '@mui/icons-material';
import Navigation from '@/components/Navigation';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <>
        <Navigation />
        <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect to sign in
  }

  return (
    <>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to Graston Guide Dashboard
          </Typography>
          <Typography variant="h6" color="textSecondary" paragraph>
            Hello, {session?.user?.name}! Manage training events, student rosters, and compliance tracking.
          </Typography>
        </Paper>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Event sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Events Overview
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Browse and search training events with filters, CEU credits, and risk badges.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => router.push('/events')}
              >
                View Events
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <People sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Student Management
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Access detailed student rosters with licensing, certifications, and progress tracking.
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => router.push('/events')}
              >
                View Students
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Dashboard sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Compliance Tracking
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Monitor student progress, certificates, and export data for reporting.
              </Typography>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => router.push('/events')}
              >
                View Reports
              </Button>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  -
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Active Events
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  -
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Students
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  -
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Certificates Issued
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
}
