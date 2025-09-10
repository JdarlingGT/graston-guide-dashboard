# Development Guide

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd graston-guide-dashboard
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

3. **Development Server**
   ```bash
   npm run dev
   ```

## Project Structure

```
├── .copilot-instructions.md    # Copilot AI guidance
├── pages/
│   ├── _app.tsx               # App wrapper with theme and auth
│   ├── _document.tsx          # Custom document for MUI SSR
│   ├── index.tsx              # Landing page (redirects to /events)
│   ├── events/
│   │   ├── index.tsx          # Events overview page
│   │   └── [id].tsx           # Event detail page
│   └── api/
│       ├── auth/              # NextAuth configuration
│       ├── events/            # Events API endpoints
│       └── participants/      # Participants API endpoints
├── components/
│   ├── Layout.tsx             # Main layout component
│   ├── EventsTable.tsx        # Events data grid
│   ├── ParticipantsTable.tsx  # Participants data grid
│   └── common/                # Shared components
├── lib/
│   ├── auth.ts               # NextAuth configuration
│   ├── api.ts                # API client utilities
│   ├── wordpress.ts          # WordPress API integration
│   └── utils.ts              # General utilities
├── types/
│   └── index.ts              # TypeScript definitions
└── styles/
    ├── globals.css           # Global styles
    └── theme.ts              # MUI theme configuration
```

## Key Development Patterns

### 1. Data Fetching with SWR
```typescript
import useSWR from 'swr';
import { Event } from '@/types';

function useEvents() {
  const { data, error, mutate } = useSWR<Event[]>('/api/events');
  return {
    events: data || [],
    isLoading: !error && !data,
    error,
    mutate
  };
}
```

### 2. API Route Pattern
```typescript
// pages/api/events/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      // Fetch events from WordPress API
      break;
    case 'POST':
      // Create new event
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

### 3. Material UI Data Grid
```typescript
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Event Name', width: 200 },
  { field: 'date', headerName: 'Date', width: 150, type: 'date' },
  { field: 'instructors', headerName: 'Instructors', width: 200 },
  // ... more columns
];

export default function EventsTable({ events }: { events: Event[] }) {
  return (
    <DataGrid
      rows={events}
      columns={columns}
      pageSize={25}
      disableSelectionOnClick
      // ... other props
    />
  );
}
```

### 4. Authentication Check
```typescript
import { useSession } from 'next-auth/react';

function ProtectedPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>Access Denied</p>;

  return <div>Protected content</div>;
}
```

## Code Style Guidelines

### TypeScript
- Always use strict TypeScript
- Define interfaces for all data structures
- Use proper typing for API responses
- Avoid `any` type unless absolutely necessary

### React Components
- Use functional components with hooks
- Implement proper loading and error states
- Use Material UI components consistently
- Follow React best practices for performance

### API Integration
- Never expose credentials client-side
- Use server-side API routes for external calls
- Implement proper error handling
- Cache API responses appropriately with SWR

### Security
- Validate all user inputs
- Mask sensitive information (emails)
- Implement proper CORS policies
- Use HTTPS in production

## Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

## Common Issues

1. **Authentication not working**: Check Google OAuth configuration
2. **API calls failing**: Verify WordPress credentials and URLs
3. **TypeScript errors**: Ensure all types are properly defined
4. **MUI styling issues**: Check theme configuration and SSR setup

## Production Deployment

1. Set environment variables for production
2. Build the application: `npm run build`
3. Start production server: `npm start`
4. Configure reverse proxy (nginx) if needed
5. Set up SSL certificates
6. Monitor application logs and performance