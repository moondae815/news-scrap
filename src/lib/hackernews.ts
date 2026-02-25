import { RawFeedItem } from '../types';

export async function fetchHackerNews(limit: number = 10): Promise<RawFeedItem[]> {
  try {
    const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const topStoryIds: number[] = await topStoriesRes.json();

    const storyPromises = topStoryIds.slice(0, limit).map(async (id) => {
      const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      return storyRes.json();
    });

    const stories = await Promise.all(storyPromises);

    return stories.map((story) => ({
      id: `hn-${story.id}`,
      source: 'Hacker News',
      title: story.title,
      url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      score: story.score,
      author: story.by,
      createdAt: new Date(story.time * 1000).toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching Hacker News:', error);
    return [];
  }
}
