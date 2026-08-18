import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const cv = defineCollection({
  type: 'content',
  schema: z.object({
    tagline: z.string(),
    description: z.string(),
  }),
});

const work = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    company: z.string(),
    project: z.string().optional(),
    role: z.string(),
    period: z.string(),
    stat: z.string().optional(),
    headline: z.string(),
    subtitle: z.string().optional(),
    confidentiality: z.string(),
    repo: z.string().url().optional(),
    tech: z.array(z.string()),
    order: z.number(),
    outcomeText: z.string().optional(),
    outcomeStats: z.array(z.object({
      number: z.string(),
      label: z.string(),
    })).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, cv, work };
