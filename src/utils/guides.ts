/**
 * Utility helpers for working with the guides content collection.
 *
 * Import these in your .astro pages to query and filter guides without
 * repeating the same logic everywhere.
 */

import { getCollection } from 'astro:content';
import type { AgeGroup } from '../content/config';

/** Return all guides, sorted newest-first by lastUpdated. */
export async function getAllGuides() {
  const guides = await getCollection('guides');
  return guides.sort(
    (a, b) =>
      b.data.lastUpdated.getTime() - a.data.lastUpdated.getTime(),
  );
}

/** Return guides that apply to a specific age group. */
export async function getGuidesByAge(age: AgeGroup) {
  const all = await getAllGuides();
  return all.filter((g) => g.data.ageGroups.includes(age));
}

/** Return guides for a specific device slug (e.g. "ipad"). */
export async function getGuidesByDevice(device: string) {
  const all = await getAllGuides();
  return all.filter((g) => g.data.device === device);
}

/** Return guides for a specific app slug (e.g. "youtube-kids"). */
export async function getGuidesByApp(app: string) {
  const all = await getAllGuides();
  return all.filter((g) => g.data.app === app);
}

/**
 * Return a deduplicated list of all device slugs that have at least one guide,
 * along with their human-readable labels.
 */
export async function getAllDevices() {
  const all = await getAllGuides();
  const map = new Map<string, string>();
  for (const g of all) {
    if (!map.has(g.data.device)) {
      map.set(g.data.device, g.data.deviceLabel);
    }
  }
  return Array.from(map.entries()).map(([slug, label]) => ({ slug, label }));
}

/**
 * Return a deduplicated list of all app slugs that have at least one guide,
 * along with their human-readable labels.
 */
export async function getAllApps() {
  const all = await getAllGuides();
  const map = new Map<string, string>();
  for (const g of all) {
    if (g.data.app !== 'device-setup' && !map.has(g.data.app)) {
      map.set(g.data.app, g.data.appLabel);
    }
  }
  return Array.from(map.entries()).map(([slug, label]) => ({ slug, label }));
}
