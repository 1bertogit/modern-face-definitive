/**
 * Content Collections Configuration
 *
 * This file defines the schema for blog posts using Astro's Content Collections.
 * Content Collections provide:
 * - Type-safe frontmatter
 * - Automatic slug generation
 * - Easy querying and sorting
 * - Built-in validation
 *
 * @see https://docs.astro.build/en/guides/content-collections/
 */

import { defineCollection, z } from 'astro:content';

/**
 * Blog Collection Schema
 *
 * Defines the required and optional frontmatter fields for blog posts.
 */
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Required fields
    title: z.string().max(150, 'Title should be under 150 characters for SEO'),
    description: z.string().max(300, 'Description should be under 300 characters'),
    category: z.string(),
    date: z.coerce.date(),

    // Optional fields
    author: z.string().default('Dr. Robério Brandão'),
    readTime: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),

    // SEO fields
    keywords: z.array(z.string()).optional(),
    canonicalUrl: z.string().url().optional(),

    // Images - aceita string (caminho) ou objeto (com src e alt)
    image: z
      .union([
        z.string(),
        z.object({
          src: z.string(),
          alt: z.string(),
        }),
      ])
      .optional(),
    ogImage: z.string().optional(),

    // Related content
    relatedPosts: z.array(z.string()).optional(),

    // Schema.org
    articleType: z
      .enum(['Article', 'MedicalWebPage', 'BlogPosting', 'NewsArticle'])
      .default('MedicalWebPage'),

    // FAQ items for SchemaFAQ
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .optional(),

    // i18n fields for multi-language support
    locale: z.enum(['pt', 'en', 'es']).default('pt'),
    canonicalSlug: z.string().optional(), // Links translations together (e.g., "what-is-modern-face")
  }),
});

/**
 * Glossary Collection Schema
 */
const glossaryCollection = defineCollection({
  type: 'content',
  schema: z.object({
    term: z.string(),
    definition: z.string(),
    category: z.string(),
    aliases: z.array(z.string()).optional(),
    relatedTerms: z.array(z.string()).optional(),
  }),
});

/**
 * Cases Collection Schema
 */
const casesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    technique: z.enum(['Endomidface', 'Deep Neck', 'Browlift', 'Face Completa']),
    patientAge: z.number(),
    surgeryTime: z.string(),
    featured: z.boolean().default(false),
    beforeImage: z.string(),
    afterImage: z.string(),
    date: z.coerce.date(),
  }),
});

export const collections = {
  blog: blogCollection,
  glossary: glossaryCollection,
  cases: casesCollection,
};
