import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { wordpressApi } from '@/lib/wordpress-api';
import * as Papa from 'papaparse';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Get event details and roster
  const [eventResult, rosterResult] = await Promise.all([
    wordpressApi.getEvent(id),
    wordpressApi.getEventRoster(id)
  ]);

  if (!eventResult.success || !rosterResult.success) {
    return NextResponse.json({ 
      error: 'Failed to fetch event data' 
    }, { status: 500 });
  }

  const event = eventResult.data!;
  const roster = rosterResult.data!;

  // Transform data for CSV export
  const csvData = roster.students.map(student => ({
    'Student ID': student.id,
    'First Name': student.firstName,
    'Last Name': student.lastName,
    'Masked Email': student.maskedEmail,
    'License Type': student.license.type,
    'License Number': student.license.number,
    'License State': student.license.state,
    'License Expiration': student.license.expirationDate,
    'Occupation': student.occupation,
    'Instruments': student.instruments.join(', '),
    'Clinic Name': student.clinic.name,
    'Clinic Address': student.clinic.address,
    'Clinic Phone': student.clinic.phone,
    'Course Progress (%)': student.learnDashProgress.progressPercentage,
    'Completed Lessons': student.learnDashProgress.completedLessons,
    'Total Lessons': student.learnDashProgress.totalLessons,
    'Last Access': student.learnDashProgress.lastAccessDate,
    'Certificate Earned': student.learnDashProgress.certificateEarned ? 'Yes' : 'No',
    'Enrollment Date': student.enrollmentDate,
    'Completion Status': student.completionStatus,
    'Certifications': student.certifications.map(cert => 
      `${cert.type} (${cert.number})`
    ).join('; ')
  }));

  // Generate CSV
  const csv = Papa.unparse(csvData);
  
  // Return CSV file
  const filename = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}_roster.csv`;
  
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}