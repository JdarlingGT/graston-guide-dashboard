'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  Person,
  School,
  People,
  ArrowBack,
} from '@mui/icons-material';
import Navigation from '@/components/Navigation';
import RosterTable from '@/components/roster/RosterTable';
import { Event, Student } from '@/types';

export default function EventDetailPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [roster, setRoster] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && eventId) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
          // In a real app, these would be actual API calls
          const mockEvent = generateMockEvent(eventId);
          const mockRoster = generateMockRoster();
          
          setEvent(mockEvent);
          setRoster(mockRoster);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          console.error('Failed to fetch event details:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [status, eventId]);

  const handleExportCsv = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/export`);
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${event?.title.replace(/[^a-zA-Z0-9]/g, '_')}_roster.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      // In a real app, show error notification
    }
  };

  // Mock data generators for demo
  const generateMockEvent = (id: string): Event => {
    const events = {
      '1': {
        id: '1',
        title: 'IASTM Fundamentals Course',
        description: 'Learn the fundamentals of Instrument Assisted Soft Tissue Mobilization with hands-on practice sessions, anatomy review, and clinical applications.',
        startDate: '2024-01-15T09:00:00Z',
        endDate: '2024-01-17T17:00:00Z',
        location: 'Indianapolis, IN - Convention Center',
        instructor: 'Dr. Sarah Johnson, PT, DPT',
        maxCapacity: 20,
        currentEnrollment: 18,
        ceuCredits: 16,
        riskLevel: 'medium' as const,
        status: 'upcoming' as const,
        tags: ['IASTM', 'Fundamentals', 'Hands-on', 'Certification']
      },
      '2': {
        id: '2',
        title: 'Advanced Fascial Mobilization',
        description: 'Advanced techniques for treating complex fascial restrictions and movement patterns with specialized assessment protocols.',
        startDate: '2024-01-22T08:00:00Z',
        endDate: '2024-01-24T18:00:00Z',
        location: 'Chicago, IL - Medical Center',
        instructor: 'Dr. Michael Chen, PT, PhD',
        maxCapacity: 16,
        currentEnrollment: 12,
        ceuCredits: 24,
        riskLevel: 'high' as const,
        status: 'upcoming' as const,
        tags: ['Advanced', 'Fascial', 'Clinical', 'Research']
      }
    };

    return events[id as keyof typeof events] || events['1'];
  };

  const generateMockRoster = (): Student[] => {
    return [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        maskedEmail: 'jo***@example.com',
        license: {
          type: 'PT',
          number: 'PT12345',
          state: 'IN',
          expirationDate: '2025-12-31'
        },
        certifications: [
          {
            type: 'IASTM Level 1',
            number: 'IASTM-001',
            issuedBy: 'Graston Technique',
            issueDate: '2023-06-15',
            expirationDate: '2025-06-15'
          }
        ],
        occupation: 'Physical Therapist',
        instruments: ['GT-1', 'GT-2', 'GT-5'],
        clinic: {
          name: 'Advanced Physical Therapy',
          address: '123 Main St, Indianapolis, IN',
          phone: '(317) 555-0123'
        },
        learnDashProgress: {
          courseId: 'course-101',
          courseName: 'IASTM Fundamentals',
          progressPercentage: 85,
          completedLessons: 17,
          totalLessons: 20,
          lastAccessDate: '2024-01-10',
          certificateEarned: false
        },
        enrollmentDate: '2023-12-01',
        completionStatus: 'in-progress'
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@clinic.com',
        maskedEmail: 'sa***@clinic.com',
        license: {
          type: 'OT',
          number: 'OT67890',
          state: 'IL',
          expirationDate: '2026-03-31'
        },
        certifications: [
          {
            type: 'IASTM Level 1',
            number: 'IASTM-002',
            issuedBy: 'Graston Technique',
            issueDate: '2022-08-20',
            expirationDate: '2024-08-20'
          },
          {
            type: 'Manual Therapy',
            number: 'MT-456',
            issuedBy: 'APTA',
            issueDate: '2021-05-10',
            expirationDate: '2024-05-10'
          }
        ],
        occupation: 'Occupational Therapist',
        instruments: ['GT-1', 'GT-3', 'GT-4', 'GT-6'],
        clinic: {
          name: 'Rehabilitation Associates',
          address: '456 Oak Ave, Chicago, IL',
          phone: '(312) 555-0456'
        },
        learnDashProgress: {
          courseId: 'course-101',
          courseName: 'IASTM Fundamentals',
          progressPercentage: 100,
          completedLessons: 20,
          totalLessons: 20,
          lastAccessDate: '2024-01-12',
          certificateEarned: true
        },
        enrollmentDate: '2023-11-15',
        completionStatus: 'completed'
      },
      {
        id: '3',
        firstName: 'Michael',
        lastName: 'Davis',
        email: 'michael.davis@sports.com',
        maskedEmail: 'mi***@sports.com',
        license: {
          type: 'ATC',
          number: 'ATC98765',
          state: 'IN',
          expirationDate: '2025-06-30'
        },
        certifications: [],
        occupation: 'Athletic Trainer',
        instruments: ['GT-2', 'GT-5'],
        clinic: {
          name: 'Sports Medicine Center',
          address: '789 Stadium Rd, Indianapolis, IN',
          phone: '(317) 555-0789'
        },
        learnDashProgress: {
          courseId: 'course-101',
          courseName: 'IASTM Fundamentals',
          progressPercentage: 45,
          completedLessons: 9,
          totalLessons: 20,
          lastAccessDate: '2024-01-08',
          certificateEarned: false
        },
        enrollmentDate: '2023-12-20',
        completionStatus: 'enrolled'
      }
    ];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (status === 'loading' || loading) {
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

  if (error) {
    return (
      <>
        <Navigation />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navigation />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="info">Event not found</Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/events')}
          sx={{ mb: 2 }}
        >
          Back to Events
        </Button>

        {/* Event Header */}
        <Paper sx={{ p: 4, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                {event.title}
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {event.description}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={event.status.charAt(0).toUpperCase() + event.status.slice(1)} 
                color={event.status === 'upcoming' ? 'primary' : 'success'}
              />
              <Chip 
                label={`${event.riskLevel.charAt(0).toUpperCase() + event.riskLevel.slice(1)} Risk`}
                color={event.riskLevel === 'high' ? 'error' : event.riskLevel === 'medium' ? 'warning' : 'success'}
                variant="outlined"
              />
            </Box>
          </Box>

          {/* Event Details */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formatTime(event.startDate)} - {formatTime(event.endDate)}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="body1">
                  {event.location}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="body1">
                  {event.instructor}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="body1">
                  {event.ceuCredits} CEU Credits
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="body1">
                  {event.currentEnrollment}/{event.maxCapacity} enrolled
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {event.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>

        <Divider sx={{ my: 3 }} />

        {/* Roster Section */}
        <Typography variant="h4" component="h2" gutterBottom>
          Student Roster
        </Typography>
        
        <RosterTable
          students={roster}
          onExportCsv={handleExportCsv}
        />
      </Container>
    </>
  );
}