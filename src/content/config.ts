import { defineCollection, z } from 'astro:content';

// ----------------------------------------------------------------
// Age group options used across the site
// ----------------------------------------------------------------
export const AGE_GROUPS = ['under-5', '5-7', '8-10', '11-13', '14+'] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  'under-5': 'Under 5',
  '5-7':     '5 – 7 years',
  '8-10':    '8 – 10 years',
  '11-13':   '11 – 13 years',
  '14+':     '14 and over',
};

// ----------------------------------------------------------------
// Risk level — how many "side-doors" remain after setup
// ----------------------------------------------------------------
export const RISK_LEVELS = ['low', 'medium', 'high'] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

// ----------------------------------------------------------------
// Guide collection
// Every guide is one MDX file inside src/content/guides/
// ----------------------------------------------------------------
const guides = defineCollection({
  type: 'content',
  schema: z.object({
    // Basic metadata
    title: z.string(),
    description: z.string(),

    // Who is this guide for?
    ageGroups: z.array(z.enum(AGE_GROUPS)),

    // Device this guide covers (use the slug form, e.g. "ipad", "amazon-fire")
    device: z.string(),
    deviceLabel: z.string(), // Human-readable, e.g. "iPad"

    // App this guide covers. Set to "device-setup" if it is a general device
    // setup guide with no specific app.
    app: z.string(),
    appLabel: z.string(), // Human-readable, e.g. "YouTube Kids"

    // Roughly how long setup takes
    timeRequired: z.string().default('15 minutes'),

    // How tricky is this for a non-technical parent?
    difficulty: z.enum(['easy', 'medium', 'hard']).default('easy'),

    // Does the parent need a separate companion device or app to administer things?
    companionRequired: z.boolean().default(false),
    // List any companion devices/apps needed (e.g. "Parent's iPhone with Family Link")
    companionDevices: z.array(z.string()).optional(),
    companionApps:   z.array(z.string()).optional(),

    // Overall risk level once the guide has been followed
    riskLevel: z.enum(RISK_LEVELS).default('medium'),

    // Short summary of remaining risks shown in the guide header
    riskSummary: z.string().optional(),

    // When this guide was last reviewed for accuracy
    lastUpdated: z.coerce.date(),

    // Optional hero/thumbnail image path (relative to /public)
    coverImage: z.string().optional(),

    // Free-form tags for search / filtering
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { guides };
