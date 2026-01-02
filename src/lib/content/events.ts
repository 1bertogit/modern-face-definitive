/**
 * Events content centralized for all locales
 */
import type { Locale } from '@lib/i18n';
import type { EventData } from '@lib/types/event';

// Helper function to get event schema
export function getEventSchema(event: EventData, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'VirtualLocation',
      url: event.platformUrl || `https://drroberiobrandao.com${getEventPath(event.slug, locale)}`,
      ...(event.platform && { name: event.platform }),
    },
    organizer: {
      '@type': 'Person',
      name: event.organizer || 'Dr. Robério Brandão',
    },
    ...(event.image && {
      image: event.image.startsWith('http') ? event.image : `https://drroberiobrandao.com${event.image}`,
    }),
    ...(event.price !== undefined && {
      offers: {
        '@type': 'Offer',
        price: event.price,
        priceCurrency: event.currency || 'USD',
        availability: 'https://schema.org/InStock',
        url: `https://drroberiobrandao.com${getEventPath(event.slug, locale)}`,
        validFrom: new Date().toISOString().split('T')[0],
      },
    }),
  };
}

// Helper function to get event path by locale
export function getEventPath(slug: string, locale: Locale): string {
  const basePath = locale === 'en' ? '/events' : locale === 'pt' ? '/pt/eventos' : '/es/eventos';
  return `${basePath}/${slug}`;
}

// Helper function to get all event paths for hreflang
export function getEventPaths(slug: string) {
  return {
    en: getEventPath(slug, 'en'),
    pt: getEventPath(slug, 'pt'),
    es: getEventPath(slug, 'es'),
  };
}

// Placeholder events data - to be filled with actual events
export const eventsContent: Record<Locale, EventData[]> = {
  en: [
    // Example event structure - replace with actual events
    {
      slug: 'modern-face-congress-2025',
      title: 'Modern Face® Online Congress 2025',
      description:
        'Join us for a comprehensive online congress covering the latest advances in facial surgery techniques, featuring live demonstrations, expert panels, and interactive Q&A sessions.',
      shortDescription: 'Comprehensive online congress on facial surgery advances',
      startDate: '2025-06-15T09:00:00-03:00',
      endDate: '2025-06-16T18:00:00-03:00',
      startTime: '09:00',
      endTime: '18:00',
      timezone: 'America/Sao_Paulo',
      price: 150,
      currency: 'USD',
      originalPrice: 200,
      platform: 'Zoom',
      platformUrl: 'https://zoom.us/j/example',
      organizer: 'Dr. Robério Brandão',
      speakers: [
        {
          name: 'Dr. Robério Brandão',
          role: 'Creator of Modern Face® Philosophy',
          specialty: 'Facial Plastic Surgery',
          bio: 'Pioneer in Direct Vision facial surgery techniques.',
        },
      ],
      schedule: [
        {
          day: 'Day 1',
          time: '09:00',
          title: 'Opening & Welcome',
          speaker: 'Dr. Robério Brandão',
          duration: '30min',
        },
      ],
      includes: [
        { icon: 'live_tv', text: 'Live streaming' },
        { icon: 'video_library', text: 'Recordings for 30 days' },
        { icon: 'description', text: 'Educational materials' },
        { icon: 'verified', text: 'Certificate of participation' },
      ],
      keywords: ['facial surgery', 'congress', 'online event', 'Dr Robério Brandão'],
      status: 'upcoming',
    },
  ],
  pt: [
    {
      slug: 'congresso-face-moderna-2025',
      title: 'Congresso Online Face Moderna® 2025',
      description:
        'Participe de um congresso online abrangente sobre os últimos avanços em técnicas de cirurgia facial, com demonstrações ao vivo, painéis de especialistas e sessões interativas de Q&A.',
      shortDescription: 'Congresso online abrangente sobre avanços em cirurgia facial',
      startDate: '2025-06-15T09:00:00-03:00',
      endDate: '2025-06-16T18:00:00-03:00',
      startTime: '09:00',
      endTime: '18:00',
      timezone: 'America/Sao_Paulo',
      price: 150,
      currency: 'USD',
      originalPrice: 200,
      platform: 'Zoom',
      platformUrl: 'https://zoom.us/j/example',
      organizer: 'Dr. Robério Brandão',
      speakers: [
        {
          name: 'Dr. Robério Brandão',
          role: 'Criador da Filosofia Face Moderna®',
          specialty: 'Cirurgia Plástica Facial',
          bio: 'Pioneiro em técnicas de cirurgia facial por Visão Direta.',
        },
      ],
      schedule: [
        {
          day: 'Dia 1',
          time: '09:00',
          title: 'Abertura e Boas-vindas',
          speaker: 'Dr. Robério Brandão',
          duration: '30min',
        },
      ],
      includes: [
        { icon: 'live_tv', text: 'Transmissão ao vivo' },
        { icon: 'video_library', text: 'Gravações por 30 dias' },
        { icon: 'description', text: 'Material didático' },
        { icon: 'verified', text: 'Certificado de participação' },
      ],
      keywords: ['cirurgia facial', 'congresso', 'evento online', 'Dr Robério Brandão'],
      status: 'upcoming',
    },
  ],
  es: [
    {
      slug: 'congreso-face-moderna-2025',
      title: 'Congreso Online Face Moderna® 2025',
      description:
        'Únase a un congreso online integral sobre los últimos avances en técnicas de cirugía facial, con demostraciones en vivo, paneles de expertos y sesiones interactivas de Q&A.',
      shortDescription: 'Congreso online integral sobre avances en cirugía facial',
      startDate: '2025-06-15T09:00:00-03:00',
      endDate: '2025-06-16T18:00:00-03:00',
      startTime: '09:00',
      endTime: '18:00',
      timezone: 'America/Sao_Paulo',
      price: 150,
      currency: 'USD',
      originalPrice: 200,
      platform: 'Zoom',
      platformUrl: 'https://zoom.us/j/example',
      organizer: 'Dr. Robério Brandão',
      speakers: [
        {
          name: 'Dr. Robério Brandão',
          role: 'Creador de la Filosofía Face Moderna®',
          specialty: 'Cirugía Plástica Facial',
          bio: 'Pionero en técnicas de cirugía facial por Visión Directa.',
        },
      ],
      schedule: [
        {
          day: 'Día 1',
          time: '09:00',
          title: 'Apertura y Bienvenida',
          speaker: 'Dr. Robério Brandão',
          duration: '30min',
        },
      ],
      includes: [
        { icon: 'live_tv', text: 'Transmisión en vivo' },
        { icon: 'video_library', text: 'Grabaciones por 30 días' },
        { icon: 'description', text: 'Material educativo' },
        { icon: 'verified', text: 'Certificado de participación' },
      ],
      keywords: ['cirugía facial', 'congreso', 'evento online', 'Dr Robério Brandão'],
      status: 'upcoming',
    },
  ],
};

// Helper to get event by slug
export function getEventBySlug(slug: string, locale: Locale): EventData | undefined {
  return eventsContent[locale].find((event) => event.slug === slug);
}

// Helper to get all events
export function getAllEvents(locale: Locale): EventData[] {
  return eventsContent[locale];
}

// Helper to get upcoming events
export function getUpcomingEvents(locale: Locale): EventData[] {
  const now = new Date();
  return eventsContent[locale].filter((event) => {
    const eventDate = new Date(event.startDate);
    return eventDate >= now && event.status !== 'past';
  });
}

// Helper to get past events
export function getPastEvents(locale: Locale): EventData[] {
  const now = new Date();
  return eventsContent[locale].filter((event) => {
    const eventDate = new Date(event.startDate);
    return eventDate < now || event.status === 'past';
  });
}

