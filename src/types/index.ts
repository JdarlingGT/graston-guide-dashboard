export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  instructor: string;
  maxCapacity: number;
  currentEnrollment: number;
  ceuCredits: number;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags: string[];
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  maskedEmail: string;
  license: {
    type: string;
    number: string;
    state: string;
    expirationDate: string;
  };
  certifications: Certification[];
  occupation: string;
  instruments: string[];
  clinic: {
    name: string;
    address: string;
    phone: string;
  };
  learnDashProgress: LearnDashProgress;
  enrollmentDate: string;
  completionStatus: 'enrolled' | 'in-progress' | 'completed' | 'withdrawn';
}

export interface Certification {
  type: string;
  number: string;
  issuedBy: string;
  issueDate: string;
  expirationDate: string;
}

export interface LearnDashProgress {
  courseId: string;
  courseName: string;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessDate: string;
  certificateEarned: boolean;
}

export interface EventRoster {
  eventId: string;
  students: Student[];
  totalEnrolled: number;
  completionRate: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchFilters {
  query: string;
  dateRange: {
    start?: string;
    end?: string;
  };
  riskLevel: ('low' | 'medium' | 'high')[];
  status: ('upcoming' | 'ongoing' | 'completed' | 'cancelled')[];
  instructor: string;
  minCeuCredits: number;
  tags: string[];
}

export interface WordPressApiConfig {
  baseUrl: string;
  username: string;
  password: string;
}