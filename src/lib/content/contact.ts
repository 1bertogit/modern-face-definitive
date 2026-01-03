/**
 * Contact page content for all locales
 */
import type { Locale } from '../i18n';

export interface ContactContent {
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  hero: {
    subtitle: string;
    title: string;
    description: string;
  };
  form: {
    title: string;
    name: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    phone: { label: string; placeholder: string };
    subject: { label: string; placeholder: string; options: string[] };
    message: { label: string; placeholder: string };
    submit: string;
    sending: string;
    success: string;
    error: string;
    required: string;
  };
  info: {
    title: string;
    address: {
      label: string;
      line1: string;
      line2: string;
      line3: string;
    };
    phone: {
      label: string;
      value: string;
    };
    email: {
      label: string;
      value: string;
    };
    hours: {
      label: string;
      weekdays: string;
      weekend: string;
    };
  };
  social: {
    title: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
}

export const contactContent: Record<Locale, ContactContent> = {
  pt: {
    meta: {
      title: 'Contato | Modern Face Institute',
      description:
        'Entre em contato com o Modern Face Institute. Tire suas dúvidas sobre técnicas de rejuvenescimento facial, cursos e formação com Dr. Robério Brandão.',
      keywords: [
        'contato',
        'Modern Face Institute',
        'Dr Robério Brandão',
        'cirurgia facial',
        'curso',
        'Natal RN',
      ],
    },
    hero: {
      subtitle: 'Fale Conosco',
      title: 'Entre em Contato',
      description:
        'Estamos prontos para responder suas dúvidas sobre técnicas, cursos e formação em cirurgia facial de visão direta.',
    },
    form: {
      title: 'Envie sua Mensagem',
      name: { label: 'Nome Completo', placeholder: 'Seu nome' },
      email: { label: 'E-mail', placeholder: 'seu@email.com' },
      phone: { label: 'Telefone', placeholder: '(84) 99999-9999' },
      subject: {
        label: 'Assunto',
        placeholder: 'Selecione um assunto',
        options: [
          'Informações sobre cursos',
          'Dúvidas sobre técnicas',
          'Agendamento de consulta',
          'Parceria/Colaboração',
          'Imprensa',
          'Outro',
        ],
      },
      message: { label: 'Mensagem', placeholder: 'Descreva sua dúvida ou solicitação...' },
      submit: 'Enviar Mensagem',
      sending: 'Enviando...',
      success: 'Mensagem enviada com sucesso! Retornaremos em breve.',
      error: 'Erro ao enviar. Tente novamente ou entre em contato por telefone.',
      required: 'Campo obrigatório',
    },
    info: {
      title: 'Informações de Contato',
      address: {
        label: 'Endereço',
        line1: 'Modern Face Institute',
        line2: 'Av. Senador Salgado Filho, 2234',
        line3: 'Natal, RN - Brasil - CEP 59075-000',
      },
      phone: {
        label: 'Telefone',
        value: '+55 84 92001-3480',
      },
      email: {
        label: 'E-mail',
        value: 'contato@drroberiobrandao.com',
      },
      hours: {
        label: 'Horário de Atendimento',
        weekdays: 'Segunda a Sexta: 8h às 18h',
        weekend: 'Sábado: 8h às 12h',
      },
    },
    social: {
      title: 'Redes Sociais',
      instagram: '@modernfaceinstitute',
      youtube: 'Modern Face Institute',
      linkedin: 'Dr. Robério Brandão',
    },
  },
  en: {
    meta: {
      title: 'Contact | Modern Face Institute',
      description:
        'Contact Modern Face Institute. Ask your questions about facial rejuvenation techniques, courses and training with Dr. Robério Brandão.',
      keywords: [
        'contact',
        'Modern Face Institute',
        'Dr Robério Brandão',
        'facial surgery',
        'course',
        'Brazil',
      ],
    },
    hero: {
      subtitle: 'Get in Touch',
      title: 'Contact Us',
      description:
        'We are ready to answer your questions about techniques, courses and training in direct vision facial surgery.',
    },
    form: {
      title: 'Send Your Message',
      name: { label: 'Full Name', placeholder: 'Your name' },
      email: { label: 'Email', placeholder: 'your@email.com' },
      phone: { label: 'Phone', placeholder: '+1 (555) 000-0000' },
      subject: {
        label: 'Subject',
        placeholder: 'Select a subject',
        options: [
          'Course information',
          'Questions about techniques',
          'Schedule consultation',
          'Partnership/Collaboration',
          'Press',
          'Other',
        ],
      },
      message: { label: 'Message', placeholder: 'Describe your question or request...' },
      submit: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent successfully! We will get back to you soon.',
      error: 'Error sending. Please try again or contact us by phone.',
      required: 'Required field',
    },
    info: {
      title: 'Contact Information',
      address: {
        label: 'Address',
        line1: 'Modern Face Institute',
        line2: 'Av. Senador Salgado Filho, 2234',
        line3: 'Natal, RN - Brazil - ZIP 59075-000',
      },
      phone: {
        label: 'Phone',
        value: '+55 84 92001-3480',
      },
      email: {
        label: 'Email',
        value: 'contact@drroberiobrandao.com',
      },
      hours: {
        label: 'Business Hours',
        weekdays: 'Monday to Friday: 8am to 6pm (BRT)',
        weekend: 'Saturday: 8am to 12pm (BRT)',
      },
    },
    social: {
      title: 'Social Media',
      instagram: '@modernfaceinstitute',
      youtube: 'Modern Face Institute',
      linkedin: 'Dr. Robério Brandão',
    },
  },
  es: {
    meta: {
      title: 'Contacto | Modern Face Institute',
      description:
        'Contacte con Modern Face Institute. Resuelva sus dudas sobre técnicas de rejuvenecimiento facial, cursos y formación con Dr. Robério Brandão.',
      keywords: [
        'contacto',
        'Modern Face Institute',
        'Dr Robério Brandão',
        'cirugía facial',
        'curso',
        'Brasil',
      ],
    },
    hero: {
      subtitle: 'Contáctenos',
      title: 'Ponte en Contacto',
      description:
        'Estamos listos para responder sus preguntas sobre técnicas, cursos y formación en cirugía facial de visión directa.',
    },
    form: {
      title: 'Envíe su Mensaje',
      name: { label: 'Nombre Completo', placeholder: 'Su nombre' },
      email: { label: 'Correo Electrónico', placeholder: 'su@email.com' },
      phone: { label: 'Teléfono', placeholder: '+34 600 000 000' },
      subject: {
        label: 'Asunto',
        placeholder: 'Seleccione un asunto',
        options: [
          'Información sobre cursos',
          'Preguntas sobre técnicas',
          'Agendar consulta',
          'Alianza/Colaboración',
          'Prensa',
          'Otro',
        ],
      },
      message: { label: 'Mensaje', placeholder: 'Describa su pregunta o solicitud...' },
      submit: 'Enviar Mensaje',
      sending: 'Enviando...',
      success: '¡Mensaje enviado con éxito! Le responderemos pronto.',
      error: 'Error al enviar. Intente nuevamente o contáctenos por teléfono.',
      required: 'Campo obligatorio',
    },
    info: {
      title: 'Información de Contacto',
      address: {
        label: 'Dirección',
        line1: 'Modern Face Institute',
        line2: 'Av. Senador Salgado Filho, 2234',
        line3: 'Natal, RN - Brasil - CP 59075-000',
      },
      phone: {
        label: 'Teléfono',
        value: '+55 84 92001-3480',
      },
      email: {
        label: 'Correo Electrónico',
        value: 'contacto@drroberiobrandao.com',
      },
      hours: {
        label: 'Horario de Atención',
        weekdays: 'Lunes a Viernes: 8h a 18h (BRT)',
        weekend: 'Sábado: 8h a 12h (BRT)',
      },
    },
    social: {
      title: 'Redes Sociales',
      instagram: '@modernfaceinstitute',
      youtube: 'Modern Face Institute',
      linkedin: 'Dr. Robério Brandão',
    },
  },
};

export function getContactSchema(locale: Locale) {
  const content = contactContent[locale];
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: content.meta.title,
    description: content.meta.description,
    mainEntity: {
      '@type': 'Organization',
      name: 'Modern Face Institute',
      telephone: content.info.phone.value,
      email: content.info.email.value,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Av. Senador Salgado Filho, 2234',
        addressLocality: 'Natal',
        addressRegion: 'RN',
        postalCode: '59075-000',
        addressCountry: 'BR',
      },
    },
  };
}
