import SkeletonDashboard from '../components/SkeletonDashboard';

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SkeletonDashboard />
    </main>
  );
}
