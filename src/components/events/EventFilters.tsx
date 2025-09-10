'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  SelectChangeEvent,
} from '@mui/material';
import { ExpandMore, Search, Clear } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SearchFilters } from '@/types';

interface EventFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  loading?: boolean;
}

export default function EventFilters({ filters, onFiltersChange, onSearch, loading }: EventFiltersProps) {
  const [expanded, setExpanded] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      query: event.target.value,
    });
  };

  const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    onFiltersChange({
      ...filters,
      status: value as ('upcoming' | 'ongoing' | 'completed' | 'cancelled')[],
    });
  };

  const handleRiskLevelChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    onFiltersChange({
      ...filters,
      riskLevel: value as ('low' | 'medium' | 'high')[],
    });
  };

  const handleInstructorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      instructor: event.target.value,
    });
  };

  const handleCeuCreditsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      minCeuCredits: parseInt(event.target.value) || 0,
    });
  };

  const handleStartDateChange = (date: Date | null) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        start: date ? date.toISOString().split('T')[0] : undefined,
      },
    });
  };

  const handleEndDateChange = (date: Date | null) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        end: date ? date.toISOString().split('T')[0] : undefined,
      },
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: '',
      dateRange: {},
      riskLevel: [],
      status: [],
      instructor: '',
      minCeuCredits: 0,
      tags: [],
    });
  };

  const hasActiveFilters = 
    filters.query ||
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.riskLevel.length > 0 ||
    filters.status.length > 0 ||
    filters.instructor ||
    filters.minCeuCredits > 0 ||
    filters.tags.length > 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* Main search bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search events..."
            value={filters.query}
            onChange={handleQueryChange}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={onSearch}
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Box>

        {/* Advanced filters */}
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography>Advanced Filters</Typography>
            {hasActiveFilters && (
              <Chip 
                size="small" 
                label="Filters Applied" 
                color="primary" 
                sx={{ ml: 2 }}
              />
            )}
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              {/* Date Range */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Date Range
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <DatePicker
                    label="Start Date"
                    value={filters.dateRange.start ? new Date(filters.dateRange.start) : null}
                    onChange={handleStartDateChange}
                    slotProps={{ textField: { size: 'small' } }}
                  />
                  <DatePicker
                    label="End Date"
                    value={filters.dateRange.end ? new Date(filters.dateRange.end) : null}
                    onChange={handleEndDateChange}
                    slotProps={{ textField: { size: 'small' } }}
                  />
                </Box>
              </Box>

              {/* Status Filter */}
              <FormControl size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  multiple
                  value={filters.status}
                  onChange={handleStatusChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>

              {/* Risk Level Filter */}
              <FormControl size="small">
                <InputLabel>Risk Level</InputLabel>
                <Select
                  multiple
                  value={filters.riskLevel}
                  onChange={handleRiskLevelChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>

              {/* Instructor Filter */}
              <TextField
                size="small"
                label="Instructor"
                value={filters.instructor}
                onChange={handleInstructorChange}
                placeholder="Filter by instructor name"
              />

              {/* Minimum CEU Credits */}
              <TextField
                size="small"
                type="number"
                label="Min CEU Credits"
                value={filters.minCeuCredits}
                onChange={handleCeuCreditsChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                startIcon={<Clear />}
                onClick={clearFilters}
                disabled={!hasActiveFilters}
              >
                Clear Filters
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </LocalizationProvider>
  );
}