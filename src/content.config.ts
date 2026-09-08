import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		projectType: z.string().optional(),
		role: z.string().optional(),
		timeline: z.string().optional(),
		team: z.string().optional(),
		heroImage: z.string().optional(),
		draft: z.boolean().optional().default(false),
		order: z.number().optional().default(0),
	}),
});

export const collections = { work };
