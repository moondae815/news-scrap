import { RawFeedItem } from '../types';

export async function fetchReddit(limit: number = 10, subreddit: string = 'programming'): Promise<RawFeedItem[]> {
  try {
    const res = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch Reddit: ${res.statusText}`);
    }

    const data = await res.json();
    const children = data.data.children;

    return children.map((child: any) => {
      const post = child.data;
      return {
        id: `reddit-${post.id}`,
        source: 'Reddit',
        title: post.title,
        url: post.url || `https://reddit.com${post.permalink}`,
        description: post.selftext ? post.selftext.substring(0, 300) : undefined,
        score: post.score,
        author: post.author,
        createdAt: new Date(post.created_utc * 1000).toISOString(),
      };
    });
  } catch (error) {
    console.error('Error fetching Reddit:', error);
    return [];
  }
}
