import * as cheerio from 'cheerio';
import { RawFeedItem } from '../types';

export async function fetchReddit(limit: number = 10, subreddit: string = 'programming'): Promise<RawFeedItem[]> {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/.rss`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) {
      console.warn(`[Reddit Fetch Warning] Failed to fetch Reddit RSS: ${res.status} ${res.statusText}`);
      return [];
    }

    const xml = await res.text();
    const $ = cheerio.load(xml, { xmlMode: true });
    const items: RawFeedItem[] = [];

    // Limit the number of entries parsed
    const entries = $('entry').slice(0, limit);

    entries.each((_, el) => {
      const entry = $(el);
      const idText = entry.find('id').text();
      const title = entry.find('title').text();
      const link = entry.find('link').attr('href') || '';
      const author = entry.find('author name').text();
      const updated = entry.find('updated').text();
      const content = entry.find('content').text();

      // Attempt to extract the actual outbound link from the HTML content if it exists.
      // Reddit RSS content includes a link to the original article like:
      // <a href="https://example.com/article">[link]</a>
      let outboundUrl = link;
      if (content) {
        const $content = cheerio.load(content);
        $content('a').each((__, aEl) => {
          const href = $content(aEl).attr('href');
          const text = $content(aEl).text();
          if (href && (text === '[link]' || !href.includes('reddit.com'))) {
            outboundUrl = href;
          }
        });
      }

      items.push({
        id: `reddit-${idText.split('_').pop() || idText}`,
        source: 'Reddit',
        title,
        url: outboundUrl,
        description: content ? cheerio.load(content).text().substring(0, 300) : undefined,
        score: 0,
        author: author || undefined,
        createdAt: updated ? new Date(updated).toISOString() : new Date().toISOString(),
      });
    });

    return items;
  } catch (error: any) {
    console.warn('[Reddit Fetch Warning] Error fetching/parsing Reddit RSS:', error.message || error);
    return [];
  }
}
