import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Each case study is a folder: src/content/work/<slug>/_meta.md (project-level
// facts + intro) plus src/content/work/<slug>/sections/NN-*.md (one file per
// section, in reading order). This lets each section carry its own editorial
// priority, visuals list, and (for card-style sections) a `cards` array,
// without forcing every case study into one flat template.
const work = defineCollection({
	loader: glob({ pattern: '*/_meta.md', base: './src/content/work' }),
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		intro: z.string(),
		heroVisual: z.string().optional(),
		// Hero header: small label above the title, and the meta row
		// (label/value pairs; categories can differ per project).
		eyebrow: z.string(),
		meta: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
		gridSize: z.enum(['standard', 'wide', 'tall']).optional().default('standard'),
		draft: z.boolean().optional().default(false),
		order: z.number().optional().default(0),
		// Optional "box" summary of the project's core problems, shown in
		// the intro right after its first paragraph (see CaseHeader).
		challenges: z
			.array(
				z.object({
					tag: z.string(),
					label: z.string(),
					heading: z.string(),
					body: z.string(),
					linkLabel: z.string().optional(),
					href: z.string().optional(),
				})
			)
			.optional(),
	}),
});

// Plain ("flat") sections: one file, one flowing body, visuals rendered
// as a block right after the heading. This remains the default — most
// sections don't yet need finer control over where a visual sits.
const workSections = defineCollection({
	loader: glob({ pattern: '*/sections/*.md', base: './src/content/work' }),
	schema: z.object({
		title: z.string(),
		// Editorial weight, not visual size alone:
		// hero = most narrative + visual space; core = independent, required section;
		// bridge = intentionally short transition; supporting = brief card-style evidence.
		priority: z.enum(['hero', 'core', 'bridge', 'supporting']),
		visuals: z.array(z.string()).optional().default([]),
		cards: z
			.array(
				z.object({
					title: z.string(),
					body: z.string(),
					visual: z.string().optional(),
				})
			)
			.optional(),
	}),
});

// "Block" sections: src/content/work/<slug>/sections/NN-name/_meta.md +
// .../blocks/NN-*.md. Used only where a visual's exact position within
// the narrative matters — placement is editorial, not automatic, so
// each block is either flowing prose or an explicit visual marker, in
// the exact order they should read.
const workSectionMeta = defineCollection({
	loader: glob({ pattern: '*/sections/*/_meta.md', base: './src/content/work' }),
	schema: z.object({
		title: z.string(),
		priority: z.enum(['hero', 'core', 'bridge', 'supporting']),
	}),
});

const workBlocks = defineCollection({
	loader: glob({ pattern: '*/sections/*/blocks/*.md', base: './src/content/work' }),
	schema: z.object({
		type: z.enum(['prose', 'visual', 'placeholder-list']).default('prose'),
		// type: 'visual' — which component to render, resolved via a
		// lookup keyed by "<section folder id>/<ref>" in [id].astro.
		ref: z.string().optional(),
		// type: 'placeholder-list' — visuals not yet given a narrative
		// position; held here (not guessed into a spot) until placement
		// is specified.
		items: z.array(z.string()).optional(),
	}),
});

// Japanese translations — currently covering only hubstep-sfa-platform —
// live in a parallel content tree (src/content/work-ja/) with the exact
// same folder/file shape and schemas as their English counterparts,
// rather than a `lang` field on the collections above. That keeps the
// English site's content, routes, and build output completely untouched;
// src/pages/ja/work/[id].astro reads from these instead. Only the
// collection shapes actually used by a block-based case study are
// defined (no `workSectionsJa` — nothing in Japanese uses the flat
// section shape yet); add it if a future Japanese case study needs it.
const workJa = defineCollection({
	loader: glob({ pattern: '*/_meta.md', base: './src/content/work-ja' }),
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		intro: z.string(),
		heroVisual: z.string().optional(),
		eyebrow: z.string(),
		meta: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
		gridSize: z.enum(['standard', 'wide', 'tall']).optional().default('standard'),
		draft: z.boolean().optional().default(false),
		order: z.number().optional().default(0),
		// Optional "box" summary of the project's core problems, shown in
		// the intro right after its first paragraph (see CaseHeader).
		challenges: z
			.array(
				z.object({
					tag: z.string(),
					label: z.string(),
					heading: z.string(),
					body: z.string(),
					linkLabel: z.string().optional(),
					href: z.string().optional(),
				})
			)
			.optional(),
	}),
});

const workSectionMetaJa = defineCollection({
	loader: glob({ pattern: '*/sections/*/_meta.md', base: './src/content/work-ja' }),
	schema: z.object({
		title: z.string(),
		priority: z.enum(['hero', 'core', 'bridge', 'supporting']),
	}),
});

const workBlocksJa = defineCollection({
	loader: glob({ pattern: '*/sections/*/blocks/*.md', base: './src/content/work-ja' }),
	schema: z.object({
		type: z.enum(['prose', 'visual', 'placeholder-list']).default('prose'),
		ref: z.string().optional(),
		items: z.array(z.string()).optional(),
	}),
});

export const collections = {
	work,
	workSections,
	workSectionMeta,
	workBlocks,
	workJa,
	workSectionMetaJa,
	workBlocksJa,
};
