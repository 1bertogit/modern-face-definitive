/**
 * Type definitions for Event/Congress pages
 */

export interface Speaker {
  name: string;
  role: string;
  specialty?: string;
  bio?: string;
  image?: string;
  social?: {
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
}

export interface ScheduleItem {
  day: string;
  time: string;
  title: string;
  speaker?: string;
  duration?: string;
  description?: string;
}

export interface Recording {
  title: string;
  speaker: string;
  duration?: string;
  url: string;
  thumbnail?: string;
  availableUntil?: string;
}

export interface EventIncludes {
  icon: string;
  text: string;
}

export interface EventData {
  slug: string;
  title: string;
  description: string;
  shortDescription?: string;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  startTime?: string; // HH:mm format
  endTime?: string; // HH:mm format
  timezone?: string;
  price?: number;
  currency?: string;
  originalPrice?: number;
  platform?: string; // Zoom, YouTube Live, etc
  platformUrl?: string;
  image?: string;
  organizer?: string;
  speakers: Speaker[];
  schedule: ScheduleItem[];
  includes: EventIncludes[];
  recordings?: Recording[];
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  keywords?: string[];
  status?: 'upcoming' | 'live' | 'past';
}

