'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Box,
  Typography,
  IconButton,
  Tooltip,
  TableSortLabel,
  TextField,
  InputAdornment,
} from '@mui/material';
import { 
  Search,
  GetApp,
  CheckCircle,
  Cancel,
  Schedule,
  School,
} from '@mui/icons-material';
import { Student } from '@/types';

interface RosterTableProps {
  students: Student[];
  onExportCsv: () => void;
}

type Order = 'asc' | 'desc';
type OrderBy = 'lastName' | 'license.state' | 'occupation' | 'learnDashProgress.progressPercentage' | 'completionStatus';

export default function RosterTable({ students, onExportCsv }: RosterTableProps) {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('lastName');
  const [searchQuery, setSearchQuery] = useState('');

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'in-progress':
        return <Schedule color="warning" />;
      case 'enrolled':
        return <School color="info" />;
      case 'withdrawn':
        return <Cancel color="error" />;
      default:
        return <School />;
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'info' | 'error' | 'default' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'enrolled':
        return 'info';
      case 'withdrawn':
        return 'error';
      default:
        return 'default';
    }
  };

  const maskEmail = (email: string): string => {
    const [username, domain] = email.split('@');
    if (username.length <= 2) return `${username}***@${domain}`;
    return `${username.substring(0, 2)}***@${domain}`;
  };

  const sortedStudents = [...students].sort((a, b) => {
    let aValue: string | number, bValue: string | number;

    switch (orderBy) {
      case 'lastName':
        aValue = a.lastName.toLowerCase();
        bValue = b.lastName.toLowerCase();
        break;
      case 'license.state':
        aValue = a.license.state;
        bValue = b.license.state;
        break;
      case 'occupation':
        aValue = a.occupation;
        bValue = b.occupation;
        break;
      case 'learnDashProgress.progressPercentage':
        aValue = a.learnDashProgress.progressPercentage;
        bValue = b.learnDashProgress.progressPercentage;
        break;
      case 'completionStatus':
        aValue = a.completionStatus;
        bValue = b.completionStatus;
        break;
      default:
        aValue = a.lastName.toLowerCase();
        bValue = b.lastName.toLowerCase();
    }

    if (order === 'desc') {
      return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
    }
    return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
  });

  const filteredStudents = sortedStudents.filter(student => 
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.occupation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.license.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.clinic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Header with search and export */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Student Roster ({filteredStudents.length} students)
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />
          <Tooltip title="Export to CSV">
            <IconButton onClick={onExportCsv} color="primary">
              <GetApp />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'lastName'}
                  direction={orderBy === 'lastName' ? order : 'asc'}
                  onClick={() => handleRequestSort('lastName')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Email</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'license.state'}
                  direction={orderBy === 'license.state' ? order : 'asc'}
                  onClick={() => handleRequestSort('license.state')}
                >
                  License
                </TableSortLabel>
              </TableCell>
              <TableCell>Certifications</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'occupation'}
                  direction={orderBy === 'occupation' ? order : 'asc'}
                  onClick={() => handleRequestSort('occupation')}
                >
                  Occupation
                </TableSortLabel>
              </TableCell>
              <TableCell>Instruments</TableCell>
              <TableCell>Clinic</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'learnDashProgress.progressPercentage'}
                  direction={orderBy === 'learnDashProgress.progressPercentage' ? order : 'asc'}
                  onClick={() => handleRequestSort('learnDashProgress.progressPercentage')}
                >
                  Progress
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'completionStatus'}
                  direction={orderBy === 'completionStatus' ? order : 'asc'}
                  onClick={() => handleRequestSort('completionStatus')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {student.firstName} {student.lastName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    {student.maskedEmail || maskEmail(student.email)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {student.license.type} - {student.license.state}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      #{student.license.number}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="textSecondary">
                      Exp: {new Date(student.license.expirationDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {student.certifications.slice(0, 2).map((cert, index) => (
                      <Chip
                        key={index}
                        label={cert.type}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                    {student.certifications.length > 2 && (
                      <Typography variant="caption" color="textSecondary">
                        +{student.certifications.length - 2} more
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {student.occupation}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {student.instruments.slice(0, 3).map((instrument, index) => (
                      <Chip
                        key={index}
                        label={instrument}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {student.instruments.length > 3 && (
                      <Typography variant="caption" color="textSecondary">
                        +{student.instruments.length - 3}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {student.clinic.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {student.clinic.address}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ width: '100%', maxWidth: 120 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ minWidth: 35 }}>
                        {student.learnDashProgress.progressPercentage}%
                      </Typography>
                      {student.learnDashProgress.certificateEarned && (
                        <School color="success" sx={{ ml: 1, fontSize: 16 }} />
                      )}
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={student.learnDashProgress.progressPercentage}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {student.learnDashProgress.completedLessons}/{student.learnDashProgress.totalLessons} lessons
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title={student.completionStatus}>
                      {getStatusIcon(student.completionStatus)}
                    </Tooltip>
                    <Chip
                      label={student.completionStatus}
                      size="small"
                      color={getStatusColor(student.completionStatus)}
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}