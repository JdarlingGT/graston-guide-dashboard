import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Button, Box, Typography, Card, CardContent, Grid } from '@mui/material'
import { Download, ArrowBack } from '@mui/icons-material'
import Layout from '../../components/Layout'
import Link from 'next/link'
import { saveAs } from 'file-saver'
import Papa from 'papaparse'

interface Student {
  id: number
  name: string
  email: string
  license_number: string
  certification_level: string
  occupation: string
  instruments_owned: string
  progress_status: string
  clinic_name: string
}

interface EventDetail {
  id: number
  title: string
  start_date: string
  end_date: string
  location: string
  capacity: number
  enrolled: number
  description: string
}

export default function EventDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [studentsLoading, setStudentsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchEventDetail()
      fetchStudents()
    }
  }, [id])

  const fetchEventDetail = async () => {
    try {
      const response = await fetch(`/api/events/${id}`)
      const data = await response.json()
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event detail:', error)
      // Mock data for development
      setEvent({
        id: Number(id),
        title: 'Basic Graston Technique Course',
        start_date: '2024-01-15',
        end_date: '2024-01-17',
        location: 'Indianapolis, IN',
        capacity: 20,
        enrolled: 18,
        description: 'Comprehensive introduction to the Graston Technique for healthcare professionals.'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch(`/api/students?event_id=${id}`)
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
      // Mock data for development
      setStudents([
        {
          id: 1,
          name: 'John Smith',
          email: 'j****@email.com',
          license_number: 'PT12345',
          certification_level: 'GT-1',
          occupation: 'Physical Therapist',
          instruments_owned: 'GT-1, GT-2',
          progress_status: 'Completed',
          clinic_name: 'Smith Physical Therapy'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 's****@email.com',
          license_number: 'OT67890',
          certification_level: 'GT-1',
          occupation: 'Occupational Therapist',
          instruments_owned: 'None',
          progress_status: 'In Progress',
          clinic_name: 'Rehabilitation Center'
        },
        {
          id: 3,
          name: 'Mike Davis',
          email: 'm****@email.com',
          license_number: 'ATC11111',
          certification_level: 'GT-2',
          occupation: 'Athletic Trainer',
          instruments_owned: 'GT-1, GT-2, GT-3',
          progress_status: 'Completed',
          clinic_name: 'Sports Medicine Clinic'
        }
      ])
    } finally {
      setStudentsLoading(false)
    }
  }

  const exportToCSV = () => {
    const csv = Papa.unparse(students.map(student => ({
      'Student ID': student.id,
      'Name': student.name,
      'Email': student.email,
      'License Number': student.license_number,
      'Certification Level': student.certification_level,
      'Occupation': student.occupation,
      'Instruments Owned': student.instruments_owned,
      'Progress Status': student.progress_status,
      'Clinic Name': student.clinic_name
    })))
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `event-${id}-roster-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'license_number', headerName: 'License', width: 120 },
    { field: 'certification_level', headerName: 'Cert Level', width: 100 },
    { field: 'occupation', headerName: 'Occupation', width: 180 },
    { field: 'instruments_owned', headerName: 'Instruments', width: 150 },
    { field: 'progress_status', headerName: 'Progress', width: 120 },
    { field: 'clinic_name', headerName: 'Clinic', width: 200 },
  ]

  if (loading) {
    return <Layout><div>Loading event details...</div></Layout>
  }

  if (!event) {
    return <Layout><div>Event not found</div></Layout>
  }

  return (
    <Layout>
      <Box sx={{ mb: 3 }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Button startIcon={<ArrowBack />} sx={{ mb: 2 }}>
            Back to Events
          </Button>
        </Link>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h4" component="h1" gutterBottom>
                  {event.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {event.description}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Start Date:</strong> {event.start_date}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>End Date:</strong> {event.end_date}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Location:</strong> {event.location}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2">
                      <strong>Enrollment:</strong> {event.enrolled} / {event.capacity}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2">
          Student Roster ({students.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={exportToCSV}
        >
          Export Roster CSV
        </Button>
      </Box>
      
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={students}
          columns={columns}
          loading={studentsLoading}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
        />
      </div>
    </Layout>
  )
}