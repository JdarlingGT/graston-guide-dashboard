# Graston Guide Dashboard

The Graston Guide Dashboard is an internal staff tool for managing training events, student rosters, and compliance data. It replaces Forest Admin with a custom Next.js application.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Application Architecture

Built with:
- Next.js 13.5.x (TypeScript, App Router disabled)
- Material UI (MUI DataGrid for tables)
- NextAuth (Google Workspace authentication restricted to @grastontechnique.com)
- SWR + Axios (API data fetching)
- PapaParse + FileSaver (CSV export functionality)
- WordPress REST API integration via `/wp-json/graston/v1`

## Working Effectively

### Initial Setup
Run these commands in sequence to bootstrap the application:
```bash
npm install  # Takes ~25 seconds. NEVER CANCEL.
```

### Development Workflow
- **Development server:** `npm run dev` - Starts in ~1.4 seconds, available at http://localhost:3000
- **Build (development):** `npm run build` - Takes ~20 seconds. NEVER CANCEL. Set timeout to 60+ minutes.
- **Production server:** `npm run start` - Requires build first, starts in ~150ms
- **Linting:** `npm run lint` - Takes ~2 seconds, shows ESLint warnings but no errors

### Security Updates
The application may have Next.js security vulnerabilities. Fix with:
```bash
npm audit fix --force  # Takes ~10 seconds, may update Next.js version
```
Always test build and lint after security updates.

### Environment Configuration
Copy `.env.local.example` to `.env.local` and configure:
- `WP_URL`: WordPress site URL (https://grastontechnique.com)
- `GR_ASTON_WP_BASIC_AUTH`: Base64 encoded WordPress credentials
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `NEXTAUTH_URL`: Application URL (http://localhost:3000 for development)
- `NEXTAUTH_SECRET`: Random string for NextAuth session encryption

**Without proper Google OAuth credentials, authentication will not work, but the application will still show the login screen.**

## Validation Scenarios

After making changes, always test:

1. **Build validation:** Run `npm run build` and ensure it completes successfully
2. **Lint validation:** Run `npm run lint` to check for code quality issues
3. **Authentication flow:** Start dev server and verify login screen appears at http://localhost:3000
4. **API endpoints:** Test that `/api/events` returns proper error responses (500 with {"error":"API error"} when credentials are invalid)

The application shows a "Staff Login Required" screen with Google OAuth when accessed. This is expected behavior without valid Google OAuth credentials.

## Project Structure

### Key Directories
- `/pages/` - Next.js pages and API routes
  - `/api/auth/[...nextauth].ts` - NextAuth configuration
  - `/api/events/` - Event management API endpoints
  - `/api/students.ts` - Student data API
  - `index.tsx` - Events overview page
  - `/events/[id].tsx` - Event detail page with roster
- `/components/` - React components
  - `Layout.tsx` - Application layout with navigation
- `/styles/` - CSS styling
- `/public/` - Static assets

### Important Files
- `package.json` - Dependencies and scripts
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `.env.local.example` - Environment variable template
- `.eslintrc.json` - ESLint configuration

## Build Times and Timeouts

**CRITICAL TIMING INFORMATION:**
- **npm install:** ~25 seconds - NEVER CANCEL, set timeout to 120+ seconds
- **npm run build:** ~20 seconds - NEVER CANCEL, set timeout to 60+ minutes for safety
- **npm run lint:** ~2 seconds
- **npm run dev:** ~1.4 seconds startup time
- **npm run start:** ~150ms startup time (requires build first)
- **npm audit fix:** ~10 seconds

**NEVER CANCEL ANY BUILD COMMAND.** Builds are fast but set generous timeouts to prevent premature cancellation.

## Common Tasks

### Testing Authentication
1. Start development server: `npm run dev`
2. Navigate to http://localhost:3000
3. Verify "Staff Login Required" screen appears
4. Google OAuth button will be visible (requires valid credentials to function)

### Testing API Integration
1. Ensure `.env.local` is configured
2. Start development server
3. Access http://localhost:3000/api/events
4. Should return `{"error":"API error"}` if WordPress credentials are invalid
5. With valid credentials, returns JSON array of events

### Code Quality
- ESLint warnings about React hooks are expected and non-blocking
- No failing tests (no test suite exists)
- TypeScript compilation must pass (included in build process)

### Making Changes
1. Always run `npm run lint` before committing
2. Always run `npm run build` to verify no compilation errors
3. Test the authentication screen loads properly
4. If modifying API routes, test endpoint responses
5. If changing authentication, verify Google OAuth configuration

## Deployment Notes
- Application is configured for Vercel deployment
- Requires environment variables to be set in production
- Google OAuth callback URL must match NEXTAUTH_URL
- WordPress API must be accessible from production environment

## Troubleshooting

### Common Issues
- **Build fails:** Check TypeScript errors, run `npm install` again
- **Dev server won't start:** Check port 3000 availability, verify `.env.local` format
- **API returns errors:** Expected without valid WordPress credentials
- **Authentication not working:** Requires valid Google OAuth credentials

### When Instructions Are Insufficient
If these instructions don't cover your specific case:
1. Check existing API files in `/pages/api/` for patterns
2. Review component structure in `/components/` and `/pages/`
3. Examine package.json for available scripts
4. Search codebase for similar implementations

The codebase follows standard Next.js patterns with TypeScript, Material UI components, and SWR for data fetching.