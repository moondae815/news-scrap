'use client';

import { useState, useMemo } from 'react';
import { AIProcessedItem } from '../types';
import NewsCard from './NewsCard';

interface Props {
  initialItems: AIProcessedItem[];
}

export default function ClientDashboard({ initialItems }: Props) {
  const [filter, setFilter] = useState<'All' | 'Hacker News' | 'Reddit' | 'GitHub'>('All');
  const [sort, setSort] = useState<'Score' | 'Latest' | 'Points'>('Score');

  const filteredAndSortedItems = useMemo(() => {
    let result = [...initialItems];

    if (filter !== 'All') {
      result = result.filter(item => item.source === filter);
    }

    result.sort((a, b) => {
      switch (sort) {
        case 'Score':
          return b.importanceScore - a.importanceScore;
        case 'Latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'Points':
          return (b.score || 0) - (a.score || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [initialItems, filter, sort]);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          Dev News Curation
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Real-time AI-curated top stories, trends, and discussions.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-500 mr-2">Source:</span>
          {['All', 'Hacker News', 'Reddit', 'GitHub'].map((source) => (
            <button
              key={source}
              onClick={() => setFilter(source as any)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === source
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {source}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500 mr-2">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="Score">AI Score</option>
            <option value="Latest">Latest</option>
            <option value="Points">Points/Stars</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filteredAndSortedItems.length > 0 ? (
          filteredAndSortedItems.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No items found matching the current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
