import * as cheerio from 'cheerio';
import { RawFeedItem } from '../types';

export async function fetchGithubTrending(limit: number = 10): Promise<RawFeedItem[]> {
  try {
    const res = await fetch('https://github.com/trending');
    if (!res.ok) {
      throw new Error(`Failed to fetch GitHub Trending: ${res.statusText}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);
    const items: RawFeedItem[] = [];

    $('article.Box-row').each((index, element) => {
      if (index >= limit) return false;

      const $element = $(element);
      const titleElement = $element.find('h2.h3 a');
      const titlePath = titleElement.attr('href') || '';
      const title = titlePath.substring(1); 
      const url = `https://github.com${titlePath}`;
      const description = $element.find('p.col-9').text().trim();
      
      const starsText = $element.find('a[href$="/stargazers"]').text().trim();
      const score = parseInt(starsText.replace(/,/g, ''), 10) || 0;

      const author = title.split('/')[0];

      items.push({
        id: `github-${title.replace('/', '-')}`,
        source: 'GitHub',
        title,
        url,
        description,
        score,
        author,
        createdAt: new Date().toISOString(), 
      });
    });

    return items;
  } catch (error) {
    console.error('Error fetching GitHub Trending:', error);
    return [];
  }
}
