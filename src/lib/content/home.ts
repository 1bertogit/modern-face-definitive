/**
 * Home page content centralized for all locales
 */
import type { Locale } from '@lib/i18n';

interface Technique {
  title: string;
  description: string;
  image: string;
  href: string;
}

interface Stat {
  value: string;
  label: string;
}

interface HomeContent {
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  quote: string;
  stats: Stat[];
  techniques: Technique[];
  methodologyLabel: string;
  methodologyTitle: string;
  discoverLabel: string;
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
}

export const homeContent: Record<Locale, HomeContent> = {
  pt: {
    hero: {
      badge: 'Face Moderna® por Dr. Robério Brandão',
      title: 'Domine em 30 Casos,',
      titleAccent: 'Não em 10 Anos.',
      subtitle:
        'Metodologia revolucionária que democratiza a segurança na cirurgia facial de plano profundo. Zero lesão nervosa permanente em 212 casos consecutivos.',
      ctaPrimary: 'Iniciar Formação',
      ctaSecondary: 'Conhecer o Método',
    },
    quote:
      'Excelência em cirurgia facial não deveria ser um segredo guardado por poucos. Nossa missão é socializá-la.',
    stats: [
      { value: '0%', label: 'Lesão Nervosa\n(212 Casos)' },
      { value: '1.5k+', label: 'Cirurgias\nRealizadas' },
      { value: '7 d', label: 'Recuperação\nMédia' },
      { value: '30', label: 'Casos para\nMaestria' },
    ],
    techniques: [
      {
        title: 'Endomidface',
        description:
          'A técnica revolucionária por visão direta. Segurança máxima sem necessidade de vídeo.',
        image: '/images/techniques/endomidface-hero.png',
        href: '/pt/tecnicas/endomidface',
      },
      {
        title: 'Browlift Evolutivo',
        description:
          'Reposicionamento natural sem o aspecto de "surpresa". Cicatrizes imperceptíveis.',
        image: '/images/techniques/browlift-hero.png',
        href: '/pt/tecnicas#browlift',
      },
      {
        title: 'Deep Neck',
        description:
          'Definição cervical HD sem remover a glândula submandibular. Segurança e estética.',
        image: '/images/techniques/deep-neck-hero.png',
        href: '/pt/tecnicas#deep-neck',
      },
    ],
    methodologyLabel: 'Metodologia',
    methodologyTitle: 'A Era da Face Moderna',
    discoverLabel: 'Descobrir',
    cta: {
      title: 'Domine a Técnica',
      subtitle:
        'Junte-se ao grupo seleto de cirurgiões que estão redefinindo o padrão ouro do rejuvenescimento facial.',
      button: 'Iniciar Formação',
    },
  },
  en: {
    hero: {
      badge: 'Face Moderna® by Dr. Robério Brandão',
      title: 'Master It in 30 Cases,',
      titleAccent: 'Not 10 Years.',
      subtitle:
        'Revolutionary methodology that democratizes safety in deep plane facial surgery. Zero permanent nerve damage in 212 consecutive cases.',
      ctaPrimary: 'Start Training',
      ctaSecondary: 'Learn the Method',
    },
    quote:
      "Excellence in facial surgery shouldn't be a secret guarded by few. Our mission is to democratize it.",
    stats: [
      { value: '0%', label: 'Nerve Damage\n(212 Cases)' },
      { value: '1.5k+', label: 'Surgeries\nPerformed' },
      { value: '7 d', label: 'Average\nRecovery' },
      { value: '30', label: 'Cases to\nMastery' },
    ],
    techniques: [
      {
        title: 'Endomidface',
        description:
          'The revolutionary direct vision technique. Maximum safety without video equipment.',
        image: '/images/techniques/endomidface-hero.png',
        href: '/techniques/endomidface',
      },
      {
        title: 'Evolutionary Browlift',
        description: 'Natural repositioning without the "surprised" look. Imperceptible scars.',
        image: '/images/techniques/browlift-hero.png',
        href: '/techniques/browlift',
      },
      {
        title: 'Deep Neck',
        description:
          'HD cervical definition without removing the submandibular gland. Safety and aesthetics.',
        image: '/images/techniques/deep-neck-hero.png',
        href: '/techniques/deep-neck',
      },
    ],
    methodologyLabel: 'Methodology',
    methodologyTitle: 'The Era of Face Moderna',
    discoverLabel: 'Discover',
    cta: {
      title: 'Master the Technique',
      subtitle:
        'Join the select group of surgeons who are redefining the gold standard of facial rejuvenation.',
      button: 'Start Training',
    },
  },
  es: {
    hero: {
      badge: 'Face Moderna® por Dr. Robério Brandão',
      title: 'Domínalo en 30 Casos,',
      titleAccent: 'No en 10 Años.',
      subtitle:
        'Metodología revolucionaria que democratiza la seguridad en cirugía facial de plano profundo. Cero lesiones nerviosas permanentes en 212 casos consecutivos.',
      ctaPrimary: 'Iniciar Formación',
      ctaSecondary: 'Conocer el Método',
    },
    quote:
      'La excelencia en cirugía facial no debería ser un secreto guardado por pocos. Nuestra misión es democratizarla.',
    stats: [
      { value: '0%', label: 'Lesión Nerviosa\n(212 Casos)' },
      { value: '1.5k+', label: 'Cirugías\nRealizadas' },
      { value: '7 d', label: 'Recuperación\nPromedio' },
      { value: '30', label: 'Casos para\nMaestría' },
    ],
    techniques: [
      {
        title: 'Endomidface',
        description:
          'La técnica revolucionaria por visión directa. Máxima seguridad sin necesidad de video.',
        image: '/images/techniques/endomidface-hero.png',
        href: '/es/tecnicas/endomidface',
      },
      {
        title: 'Browlift Evolutivo',
        description:
          'Reposicionamiento natural sin el aspecto de "sorpresa". Cicatrices imperceptibles.',
        image: '/images/techniques/browlift-hero.png',
        href: '/es/tecnicas#browlift',
      },
      {
        title: 'Deep Neck',
        description:
          'Definición cervical HD sin remover la glándula submandibular. Seguridad y estética.',
        image: '/images/techniques/deep-neck-hero.png',
        href: '/es/tecnicas#deep-neck',
      },
    ],
    methodologyLabel: 'Metodología',
    methodologyTitle: 'La Era de Face Moderna',
    discoverLabel: 'Descubrir',
    cta: {
      title: 'Domina la Técnica',
      subtitle:
        'Únete al grupo selecto de cirujanos que están redefiniendo el estándar de oro del rejuvenecimiento facial.',
      button: 'Iniciar Formación',
    },
  },
};

/**
 * Get person schema for home page
 */
export function getHomeSchema(locale: Locale) {
  const descriptions: Record<Locale, string> = {
    pt: 'Criador da Face Moderna® e Endomidface por Visão Direta. 18+ anos, 1500+ cirurgias, 0% lesão nervosa permanente.',
    en: 'Creator of Face Moderna® and Endomidface by Direct Vision. 18+ years, 1500+ surgeries, 0% permanent nerve damage.',
    es: 'Creador de Face Moderna® y Endomidface por Visión Directa. 18+ años, 1500+ cirugías, 0% lesión nerviosa permanente.',
  };

  const alternateName: Record<Locale, string> = {
    pt: 'Criador da Face Moderna',
    en: 'Creator of Face Moderna',
    es: 'Creador de Face Moderna',
  };

  const jobTitle: Record<Locale, string> = {
    pt: 'Cirurgião Plástico',
    en: 'Plastic Surgeon',
    es: 'Cirujano Plástico',
  };

  const urlSuffix = locale === 'en' ? '' : locale === 'pt' ? '/pt' : `/${locale}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Dr. Robério Brandão',
    alternateName: alternateName[locale],
    jobTitle: jobTitle[locale],
    description: descriptions[locale],
    knowsAbout: [
      'Endomidface',
      'Face Moderna',
      locale === 'en' ? 'Facelift' : 'Lifting Facial',
      'Browlift',
      'Deep Neck',
    ],
    url: `https://drroberiobrandao.com${urlSuffix}`,
  };
}

/**
 * Get CTA paths for home page based on locale
 * @param locale - Target locale for the paths
 * @returns Object containing training and method page paths
 * @example
 * ```ts
 * const paths = getHomePaths('en');
 * // Returns: { training: '/education/core-programs/endomidface-direct-vision', method: '/modern-face' }
 * ```
 */
export function getHomePaths(locale: Locale) {
  const paths: Record<Locale, { training: string; method: string }> = {
    pt: { training: '/pt/formacao', method: '/pt/face-moderna' },
    en: { training: '/training/endomidface-course', method: '/modern-face' },
    es: { training: '/es/formacion/curso-endomidface', method: '/es/face-moderna' },
  };
  return paths[locale];
}
