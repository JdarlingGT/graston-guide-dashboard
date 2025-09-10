/**
 * Core type definitions for the Graston Dashboard
 * These types define the data structures used throughout the application
 */

// Risk level enumeration
export type RiskLevel = 'High' | 'Medium' | 'Low';

// Event status types
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

// Certification levels
export type CertificationLevel = 'M1' | 'M2' | 'Basic' | 'Advanced' | 'Instructor';

// Main Event interface
export interface Event {
  id: string;
  name: string;
  date: string; // ISO date string
  endDate?: string; // ISO date string for multi-day events
  instructors: string[];
  location: string;
  ceusOffered: number;
  riskLevel: RiskLevel;
  status: EventStatus;
  capacity: number;
  enrolled: number;
  description?: string;
  prerequisites?: string[];
  createdAt: string;
  updatedAt: string;
}

// Participant/Roster entry interface
export interface Participant {
  id: string;
  eventId: string;
  name: string;
  email: string; // This should be masked when displayed/exported
  licenseNumber?: string;
  licenseState?: string;
  certification: CertificationLevel;
  occupation: string;
  instrumentPurchased: boolean;
  clinic?: string;
  learnDashProgress: number; // Percentage 0-100
  registrationDate: string;
  specialRequirements?: string;
  notes?: string;
}

// API Response wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Paginated response for lists
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter and search interfaces
export interface EventFilters {
  dateFrom?: string;
  dateTo?: string;
  instructors?: string[];
  riskLevels?: RiskLevel[];
  status?: EventStatus[];
  searchQuery?: string;
}

export interface ParticipantFilters {
  certificationLevels?: CertificationLevel[];
  instrumentPurchased?: boolean;
  progressRange?: {
    min: number;
    max: number;
  };
  searchQuery?: string;
}

// Export configuration
export interface ExportConfig {
  maskEmails: boolean;
  includeNotes: boolean;
  includeSpecialRequirements: boolean;
  dateFormat: 'ISO' | 'US' | 'EU';
}

// NextAuth extended user type
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  domain: string; // Should always be 'grastontechnique.com'
  role: 'staff' | 'admin'; // For future role-based access
}

// WordPress API response types
export interface WordPressApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// SWR hook return types
export interface UseEventsReturn {
  events: Event[];
  isLoading: boolean;
  error: any;
  mutate: () => void;
}

export interface UseEventReturn {
  event: Event | null;
  participants: Participant[];
  isLoading: boolean;
  error: any;
  mutate: () => void;
}