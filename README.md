# Graston Dashboard

Internal staff dashboard for managing training events, student rosters, and compliance. This tool replaces Forest Admin and provides comprehensive event management capabilities for Graston Technique staff.

## 🚀 Features

- **Events Overview**: Browse upcoming and past training events with search, filters, and risk assessment
- **Event Details**: Comprehensive event information with participant roster management
- **CSV Exports**: Export events and rosters with proper data privacy controls
- **Staff Authentication**: Google Workspace login restricted to `@grastontechnique.com`
- **Responsive Design**: Optimized for desktop and tablet usage

## 🛠 Technology Stack

- **Frontend**: Next.js with TypeScript
- **UI Components**: Material UI (MUI) with DataGrid
- **Authentication**: NextAuth with Google OAuth
- **Data Fetching**: SWR + Axios
- **Exports**: PapaParse + FileSaver
- **API Integration**: WordPress REST API + WooCommerce

## 🏗 Architecture

```
├── pages/
│   ├── api/              # Backend API routes
│   ├── index.tsx         # Events overview page
│   └── events/
│       └── [id].tsx      # Event detail page
├── components/           # Reusable UI components
├── lib/                 # Utilities and API helpers
├── types/               # TypeScript definitions
└── styles/              # Global styles and theme
```

## 🔐 Security & Privacy

- Domain-restricted authentication (`@grastontechnique.com` only)
- Masked email addresses in exports and displays
- Server-side API credential management
- Input validation and sanitization
- Secure session handling

## 📋 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Google Workspace domain access
- WordPress API credentials

### Environment Variables

Create a `.env.local` file with:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
WP_API_URL=https://your-wordpress-site.com/wp-json/graston/v1
WP_API_USER=your-wp-api-user
WP_API_PASSWORD=your-wp-api-password
```

### Installation & Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to access the dashboard.

## 📊 Data Sources

- **WordPress REST API**: Primary data source for events and participants
- **WooCommerce API**: Instrument purchase and order data (future implementation)
- **LearnDash**: Precourse progress tracking

## 🔄 Development Workflow

1. Follow TypeScript best practices
2. Use Material UI components consistently  
3. Implement SWR for data fetching
4. Route API calls through `/api/*` endpoints
5. Test authentication flows thoroughly
6. Validate responsive design

## 📈 Future Enhancements

- Advanced reporting and analytics
- Student progress drill-down views
- CRM system integration
- Automated notification system
- Enhanced search and filtering

## 🚫 Out of Scope

- External-facing public views
- Direct customer access
- Payment processing
- User account management
- Data persistence beyond API calls

---

**Internal Tool Only** - This dashboard is exclusively for Graston Technique staff use.
