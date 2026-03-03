import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const cv = defineCollection({
  type: 'content',
  schema: z.object({
    tagline: z.string(),
  }),
});

export const collections = { blog, cv };
