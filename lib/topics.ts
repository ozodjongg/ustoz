import raw from '../data/topics.json';
import type { Topic, TopicsFile } from '../types';

export const data = raw as TopicsFile;
export const topics: Topic[] = data.topics;

export const topicBySlug = (slug: string) => topics.find(t => t.slug === slug);
export const topicTitle = (slug: string) => topicBySlug(slug)?.title || slug;

export const pointsLabel = (p: number) => `${String(p).replace('.', ',')} ball`;
