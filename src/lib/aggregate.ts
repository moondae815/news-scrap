import { unstable_cache } from 'next/cache';
import { fetchHackerNews } from './hackernews';
import { fetchReddit } from './reddit';
import { fetchGithubTrending } from './github';
import { processFeedItems } from './openai';
import { AIProcessedItem } from '../types';

export const getAggregatedNews = unstable_cache(
  async (): Promise<AIProcessedItem[]> => {
    console.log('Fetching fresh data from sources...');
    const [hnItems, redditItems, githubItems] = await Promise.all([
      fetchHackerNews(10),
      fetchReddit(10, 'programming'),
      fetchGithubTrending(10),
    ]);

    const allItems = [...hnItems, ...redditItems, ...githubItems];
    
    if (allItems.length === 0) {
      return [];
    }

    console.log(`Processing ${allItems.length} items with OpenAI...`);
    const processedItems = await processFeedItems(allItems);
    
    return processedItems;
  },
  ['aggregated-news'],
  {
    revalidate: 1800,
  }
);
