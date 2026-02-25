export interface RawFeedItem {
  id: string;
  source: 'Hacker News' | 'Reddit' | 'GitHub';
  title: string;
  url: string;
  description?: string;
  score?: number;
  author?: string;
  createdAt: string;
}

export interface AIProcessedItem extends RawFeedItem {
  summary: string;
  importanceScore: number;
}

export interface APIResponse {
  items: AIProcessedItem[];
  lastUpdated: string;
}
