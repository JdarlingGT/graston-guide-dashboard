# Graston Guide Dashboard

Internal staff dashboard for managing training events, student rosters, and compliance.

## Features

- **Google Workspace Authentication**: Secure login restricted to @grastontechnique.com domain
- **Events Overview**: Search, filter, and view training events with CEU credits and risk badges
- **Event Details**: Comprehensive roster information including licenses, certifications, and progress tracking
- **WordPress Integration**: Seamless connection to WordPress API for data management
- **CSV Export**: Export roster data for analysis and reporting

## Technology Stack

- **Next.js 15** with TypeScript
- **Material-UI (MUI)** for component library
- **NextAuth.js** for authentication
- **WordPress API** integration
- **Tailwind CSS** for styling

## Getting Started

First, install dependencies:

```bash
npm install
```

Set up your environment variables by creating a `.env.local` file:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
WORDPRESS_API_URL=your-wordpress-site.com/wp-json/graston/v1
WORDPRESS_API_USERNAME=your-username
WORDPRESS_API_PASSWORD=your-password
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app` - Next.js app directory with pages and layouts
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and API clients
- `/src/types` - TypeScript type definitions
- `/src/app/api` - API routes for WordPress integration
