import { AIProcessedItem } from '../types';
import { ExternalLink, Star, MessageSquare, TrendingUp, Clock } from 'lucide-react';

export default function NewsCard({ item }: { item: AIProcessedItem }) {
  const getIcon = () => {
    switch (item.source) {
      case 'Hacker News':
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case 'Reddit':
        return <MessageSquare className="w-4 h-4 text-orange-600" />;
      case 'GitHub':
        return <Star className="w-4 h-4 text-gray-800 dark:text-gray-200" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-500 font-bold';
    if (score >= 60) return 'text-orange-500 font-semibold';
    if (score >= 40) return 'text-yellow-600 font-medium';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            {getIcon()}
            <span>{item.source}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span suppressHydrationWarning>
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </span>
          </div>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 leading-tight group flex items-start gap-2"
          >
            {item.title}
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex-shrink-0" />
          </a>
        </div>
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg p-3 min-w-[60px]">
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Score</span>
          <span className={`text-xl ${getScoreColor(item.importanceScore)}`}>
            {item.importanceScore}
          </span>
        </div>
      </div>

      <div className="mt-4 bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold text-blue-700 dark:text-blue-400 mr-2">AI Summary:</span>
          {item.summary}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        {item.author && (
          <span>By {item.author}</span>
        )}
        {item.score !== undefined && (
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span suppressHydrationWarning>
              {item.score.toLocaleString()} points
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
