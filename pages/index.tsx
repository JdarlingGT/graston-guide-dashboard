import { useState, useEffect } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Button, Chip, Box } from '@mui/material'
import { Download } from '@mui/icons-material'
import Layout from '../components/Layout'
import Link from 'next/link'
import { saveAs } from 'file-saver'
import Papa from 'papaparse'

interface Event {
  id: number
  title: string
  start_date: string
  end_date: string
  location: string
  capacity: number
  enrolled: number
  risk_level: 'low' | 'medium' | 'high'
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      
      // Transform data to include risk calculation
      const eventsWithRisk = data.map((event: any) => ({
        ...event,
        risk_level: calculateRiskLevel(event.enrolled, event.capacity)
      }))
      
      setEvents(eventsWithRisk)
    } catch (error) {
      console.error('Error fetching events:', error)
      // Set mock data for development
      setEvents([
        {
          id: 1,
          title: 'Basic Graston Technique Course',
          start_date: '2024-01-15',
          end_date: '2024-01-17',
          location: 'Indianapolis, IN',
          capacity: 20,
          enrolled: 18,
          risk_level: 'high'
        },
        {
          id: 2,
          title: 'Advanced Graston Course',
          start_date: '2024-02-10',
          end_date: '2024-02-12',
          location: 'Chicago, IL',
          capacity: 15,
          enrolled: 8,
          risk_level: 'low'
        },
        {
          id: 3,
          title: 'Instructor Training',
          start_date: '2024-03-05',
          end_date: '2024-03-07',
          location: 'Atlanta, GA',
          capacity: 12,
          enrolled: 10,
          risk_level: 'medium'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const calculateRiskLevel = (enrolled: number, capacity: number): 'low' | 'medium' | 'high' => {
    const ratio = enrolled / capacity
    if (ratio >= 0.85) return 'high'
    if (ratio >= 0.65) return 'medium'
    return 'low'
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  const exportToCSV = () => {
    const csv = Papa.unparse(events.map(event => ({
      'Event ID': event.id,
      'Title': event.title,
      'Start Date': event.start_date,
      'End Date': event.end_date,
      'Location': event.location,
      'Capacity': event.capacity,
      'Enrolled': event.enrolled,
      'Risk Level': event.risk_level,
      'Utilization %': Math.round((event.enrolled / event.capacity) * 100)
    })))
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `events-overview-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Event',
      width: 300,
      renderCell: (params) => (
        <Link href={`/events/${params.row.id}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
          {params.value}
        </Link>
      ),
    },
    { field: 'start_date', headerName: 'Start Date', width: 120 },
    { field: 'end_date', headerName: 'End Date', width: 120 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'enrolled', headerName: 'Enrolled', width: 80 },
    { field: 'capacity', headerName: 'Capacity', width: 80 },
    {
      field: 'utilization',
      headerName: 'Utilization',
      width: 100,
      valueGetter: (params) => `${Math.round((params.row.enrolled / params.row.capacity) * 100)}%`
    },
    {
      field: 'risk_level',
      headerName: 'Risk Level',
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value.toUpperCase()} 
          color={getRiskColor(params.value) as any}
          size="small"
        />
      ),
    },
  ]

  return (
    <Layout>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Events Overview</h1>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={exportToCSV}
        >
          Export CSV
        </Button>
      </Box>
      
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={events}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
        />
      </div>
    </Layout>
  )
}