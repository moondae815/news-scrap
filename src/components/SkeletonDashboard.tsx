export default function SkeletonDashboard() {
  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="h-10 flex-1 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-white dark:bg-gray-800 rounded-xl animate-pulse shadow-sm border border-gray-100 dark:border-gray-700" />
          ))}
        </div>
      </div>
    </div>
  );
}
