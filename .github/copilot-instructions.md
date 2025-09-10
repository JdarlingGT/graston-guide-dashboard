# Copilot Instructions for Graston Dashboard

## Overview
This repository hosts the **Graston Dashboard**, an internal staff tool replacing Forest Admin for managing training events, rosters, and compliance.

It is built with:
- Next.js (TypeScript, App Router disabled for now)
- Material UI (MUI DataGrid for tables)
- NextAuth (Google Workspace login restricted to `@grastontechnique.com`)
- SWR + Axios (API fetching)
- PapaParse + FileSaver (CSV exports)

The app communicates with:
- WordPress REST API (`/wp-json/graston/v1`) using Basic Auth stored in environment variables
- WooCommerce endpoints for instrument/order lookups (future work)

## Key Features
- **Events Overview Page**  
  - List upcoming/past training events with search, filters, CEU credits, and risk badges (High/Medium/Low).  
  - Export all events to CSV.  

- **Event Detail Page**  
  - Show event metadata (name, date, instructors, CEUs).  
  - Roster table with: name, license #/state, certification, occupation, instrument purchase, masked email, LearnDash precourse progress, clinic.  
  - Export roster to CSV.  

- **Authentication**  
  - Staff-only access via NextAuth + Google provider.  
  - Restrict to `@grastontechnique.com` domain.  

## Guidance for Copilot
- Follow existing coding style (TypeScript, functional components, hooks, SWR).  
- Use MUI components for UI consistency.  
- Keep code modular (API routes in `/pages/api`, UI in `/pages` and `/components`).  
- Never expose API credentials client-side — always route through `/api/*`.  
- Keep exports safe: mask emails by default, only unmask if explicitly authorized.  
- Extend with reports and student drill-downs in future iterations.  

## Out of Scope
- No external-facing views (internal only).  
- No automated notifications (future CRM/Woo integration).  
- No memory persistence beyond API calls.