import OpenAI from 'openai';
import { RawFeedItem, AIProcessedItem } from '../types';

let openaiClient: OpenAI | null = null;

function getOpenAIClient() {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export async function processFeedItems(items: RawFeedItem[]): Promise<AIProcessedItem[]> {
  if (!items.length) return [];

  const openai = getOpenAIClient();
  if (!openai) {
    console.warn('OPENAI_API_KEY is not set. Skipping AI processing.');
    return items.map(item => ({
      ...item,
      summary: 'AI summary disabled (Missing API Key)',
      importanceScore: 0,
    }));
  }

  const prompt = `
    Analyze the following list of news and trending items for a developer.
    For each item, provide:
    1. A summary in Korean, within 10 lines (한국어로 10줄 이내로 요약).
    2. An importance score from 1 to 100 based on general popularity, relevance to developers, and potential impact.

    Return the result strictly as a JSON object with an "items" array, where each object inside the array has:
    - id (string, matching the input item id)
    - summary (string)
    - importanceScore (number)

    Items:
    ${JSON.stringify(
      items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        source: item.source,
      })),
      null,
      2
    )}
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert technical editor curating the most important news for software developers. You respond strictly in valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('Failed to generate AI response');
  }

  try {
    const parsed = JSON.parse(content);
    const results = Array.isArray(parsed) ? parsed : (parsed.items || parsed.result || []);

    const processedItems: AIProcessedItem[] = items.map(item => {
      const aiResult = results.find((r: any) => String(r.id) === String(item.id));
      return {
        ...item,
        summary: aiResult?.summary || 'Summary unavailable',
        importanceScore: aiResult?.importanceScore || 0,
      };
    });

    return processedItems;
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    return items.map(item => ({
      ...item,
      summary: 'Error generating summary',
      importanceScore: 0,
    }));
  }
}
