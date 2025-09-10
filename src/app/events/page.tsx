'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import Navigation from '@/components/Navigation';
import EventCard from '@/components/events/EventCard';
import EventFilters from '@/components/events/EventFilters';
import { Event, SearchFilters } from '@/types';

export default function EventsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    dateRange: {},
    riskLevel: [],
    status: [],
    instructor: '',
    minCeuCredits: 0,
    tags: [],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const fetchEvents = useCallback(async () => {
    if (status !== 'authenticated') return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (filters.query) params.append('search', filters.query);
      if (filters.status.length > 0) params.append('status', filters.status.join(','));
      if (filters.instructor) params.append('instructor', filters.instructor);
      if (filters.dateRange.start) params.append('dateFrom', filters.dateRange.start);
      if (filters.dateRange.end) params.append('dateTo', filters.dateRange.end);
      
      // Mock implementation for demo - in production this would fetch from the API
      // const response = await fetch(`/api/events?${params.toString()}`);
      
      // Mock filtering and pagination since we don't have real data
      let filteredEvents = generateMockEvents();
      
      // Apply client-side filtering for demo
      if (filters.query) {
        filteredEvents = filteredEvents.filter(event => 
          event.title.toLowerCase().includes(filters.query.toLowerCase()) ||
          event.description.toLowerCase().includes(filters.query.toLowerCase()) ||
          event.instructor.toLowerCase().includes(filters.query.toLowerCase())
        );
      }
      
      if (filters.status.length > 0) {
        filteredEvents = filteredEvents.filter(event => 
          filters.status.includes(event.status)
        );
      }
      
      if (filters.riskLevel.length > 0) {
        filteredEvents = filteredEvents.filter(event => 
          filters.riskLevel.includes(event.riskLevel)
        );
      }
      
      if (filters.instructor) {
        filteredEvents = filteredEvents.filter(event => 
          event.instructor.toLowerCase().includes(filters.instructor.toLowerCase())
        );
      }
      
      if (filters.minCeuCredits > 0) {
        filteredEvents = filteredEvents.filter(event => 
          event.ceuCredits >= filters.minCeuCredits
        );
      }

      // Pagination
      const eventsPerPage = 9;
      const totalEvents = filteredEvents.length;
      setTotalPages(Math.ceil(totalEvents / eventsPerPage));
      
      const startIndex = (page - 1) * eventsPerPage;
      const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);
      
      setEvents(paginatedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, page, status]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleSearch = () => {
    fetchEvents();
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Mock data generator for demo purposes
  const generateMockEvents = (): Event[] => {
    return [
      {
        id: '1',
        title: 'IASTM Fundamentals Course',
        description: 'Learn the fundamentals of Instrument Assisted Soft Tissue Mobilization with hands-on practice.',
        startDate: '2024-01-15T09:00:00Z',
        endDate: '2024-01-17T17:00:00Z',
        location: 'Indianapolis, IN',
        instructor: 'Dr. Sarah Johnson',
        maxCapacity: 20,
        currentEnrollment: 18,
        ceuCredits: 16,
        riskLevel: 'medium',
        status: 'upcoming',
        tags: ['IASTM', 'Fundamentals', 'Hands-on']
      },
      {
        id: '2',
        title: 'Advanced Fascial Mobilization',
        description: 'Advanced techniques for treating complex fascial restrictions and movement patterns.',
        startDate: '2024-01-22T08:00:00Z',
        endDate: '2024-01-24T18:00:00Z',
        location: 'Chicago, IL',
        instructor: 'Dr. Michael Chen',
        maxCapacity: 16,
        currentEnrollment: 12,
        ceuCredits: 24,
        riskLevel: 'high',
        status: 'upcoming',
        tags: ['Advanced', 'Fascial', 'Clinical']
      },
      {
        id: '3',
        title: 'Pediatric IASTM Certification',
        description: 'Specialized training for applying IASTM techniques in pediatric populations.',
        startDate: '2024-02-05T09:00:00Z',
        endDate: '2024-02-07T16:00:00Z',
        location: 'Phoenix, AZ',
        instructor: 'Dr. Lisa Anderson',
        maxCapacity: 12,
        currentEnrollment: 8,
        ceuCredits: 20,
        riskLevel: 'low',
        status: 'upcoming',
        tags: ['Pediatric', 'Certification', 'Specialized']
      },
      {
        id: '4',
        title: 'Sports Medicine Applications',
        description: 'IASTM applications specific to sports medicine and athletic performance.',
        startDate: '2024-02-12T10:00:00Z',
        endDate: '2024-02-14T17:00:00Z',
        location: 'Miami, FL',
        instructor: 'Dr. Robert Taylor',
        maxCapacity: 25,
        currentEnrollment: 22,
        ceuCredits: 18,
        riskLevel: 'medium',
        status: 'ongoing',
        tags: ['Sports Medicine', 'Performance', 'Athletic']
      },
      {
        id: '5',
        title: 'Research Methodology Workshop',
        description: 'Learn to design and conduct research studies in manual therapy.',
        startDate: '2024-01-08T09:00:00Z',
        endDate: '2024-01-10T17:00:00Z',
        location: 'Boston, MA',
        instructor: 'Dr. Emily Rodriguez',
        maxCapacity: 30,
        currentEnrollment: 30,
        ceuCredits: 22,
        riskLevel: 'low',
        status: 'completed',
        tags: ['Research', 'Methodology', 'Academic']
      },
      {
        id: '6',
        title: 'Cervical Spine Specialization',
        description: 'Advanced cervical spine assessment and treatment techniques.',
        startDate: '2024-03-01T08:30:00Z',
        endDate: '2024-03-03T17:30:00Z',
        location: 'Seattle, WA',
        instructor: 'Dr. James Wilson',
        maxCapacity: 18,
        currentEnrollment: 4,
        ceuCredits: 26,
        riskLevel: 'high',
        status: 'upcoming',
        tags: ['Cervical', 'Specialization', 'Advanced']
      }
    ];
  };

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
        <Typography variant="h3" component="h1" gutterBottom>
          Training Events
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Browse and manage training events, view enrollment status, and access detailed information.
        </Typography>

        <EventFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          loading={loading}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {events.length === 0 ? (
              <Alert severity="info">
                No events found matching your search criteria.
              </Alert>
            ) : (
              <>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                  Showing {events.length} event{events.length !== 1 ? 's' : ''}
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { 
                    xs: '1fr', 
                    md: '1fr 1fr', 
                    lg: '1fr 1fr 1fr' 
                  }, 
                  gap: 3, 
                  mb: 4 
                }}>
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </Box>

                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
}