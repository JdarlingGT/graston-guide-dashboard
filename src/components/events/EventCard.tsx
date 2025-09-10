'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  Person,
  School,
  Warning,
  Info,
  CheckCircle,
} from '@mui/icons-material';
import { Event } from '@/types';
import Link from 'next/link';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getRiskColor = (riskLevel: string): 'error' | 'warning' | 'success' | 'default' => {
    switch (riskLevel) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <Warning />;
      case 'medium':
        return <Info />;
      case 'low':
        return <CheckCircle />;
      default:
        return <Info />;
    }
  };

  const getStatusColor = (status: string): 'primary' | 'success' | 'default' | 'error' => {
    switch (status) {
      case 'upcoming':
        return 'primary';
      case 'ongoing':
        return 'success';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const enrollmentPercentage = (event.currentEnrollment / event.maxCapacity) * 100;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
            {event.title}
          </Typography>
          <Tooltip title={`Risk Level: ${event.riskLevel}`}>
            <IconButton size="small" color={getRiskColor(event.riskLevel)}>
              {getRiskIcon(event.riskLevel)}
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" color="textSecondary" paragraph>
          {event.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">
            {formatDate(event.startDate)} - {formatDate(event.endDate)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOn sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">{event.location}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Person sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">{event.instructor}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <School sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2">
            {event.ceuCredits} CEU Credits
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip 
            label={event.status.charAt(0).toUpperCase() + event.status.slice(1)} 
            color={getStatusColor(event.status)}
            size="small"
          />
          {event.tags.map((tag, index) => (
            <Chip key={index} label={tag} size="small" variant="outlined" />
          ))}
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Enrollment: {event.currentEnrollment}/{event.maxCapacity}
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: 8,
              backgroundColor: 'grey.200',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: `${enrollmentPercentage}%`,
                height: '100%',
                backgroundColor: enrollmentPercentage > 90 ? 'error.main' : 
                                enrollmentPercentage > 75 ? 'warning.main' : 'success.main',
                borderRadius: 4,
              }}
            />
          </Box>
        </Box>
      </CardContent>

      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          component={Link}
          href={`/events/${event.id}`}
          variant="contained"
          fullWidth
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
}