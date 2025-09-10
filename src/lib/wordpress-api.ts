import { Event, Student, EventRoster, ApiResponse, WordPressApiConfig } from '@/types';

class WordPressApiClient {
  private config: WordPressApiConfig;

  constructor() {
    this.config = {
      baseUrl: process.env.WORDPRESS_API_URL || '',
      username: process.env.WORDPRESS_API_USERNAME || '',
      password: process.env.WORDPRESS_API_PASSWORD || '',
    };
  }

  private getAuthHeaders(): Record<string, string> {
    const credentials = Buffer.from(`${this.config.username}:${this.config.password}`).toString('base64');
    return {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    };
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = `${this.config.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('WordPress API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getEvents(filters?: {
    search?: string;
    status?: string;
    instructor?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<Event[]>> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.instructor) params.append('instructor', filters.instructor);
    if (filters?.dateFrom) params.append('date_from', filters.dateFrom);
    if (filters?.dateTo) params.append('date_to', filters.dateTo);

    const queryString = params.toString();
    const endpoint = `/events${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<Event[]>(endpoint);
  }

  async getEvent(id: string): Promise<ApiResponse<Event>> {
    return this.makeRequest<Event>(`/events/${id}`);
  }

  async getEventRoster(eventId: string): Promise<ApiResponse<EventRoster>> {
    return this.makeRequest<EventRoster>(`/events/${eventId}/roster`);
  }

  async getStudents(filters?: {
    search?: string;
    eventId?: string;
  }): Promise<ApiResponse<Student[]>> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.eventId) params.append('event_id', filters.eventId);

    const queryString = params.toString();
    const endpoint = `/students${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<Student[]>(endpoint);
  }

  async getStudent(id: string): Promise<ApiResponse<Student>> {
    return this.makeRequest<Student>(`/students/${id}`);
  }
}

export const wordpressApi = new WordPressApiClient();