import { Suspense } from 'react';
import { getAggregatedNews } from '../lib/aggregate';
import ClientDashboard from '../components/ClientDashboard';
import SkeletonDashboard from '../components/SkeletonDashboard';

export const revalidate = 1800;

async function NewsList() {
  const items = await getAggregatedNews();
  return <ClientDashboard initialItems={items} />;
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Suspense fallback={<SkeletonDashboard />}>
        <NewsList />
      </Suspense>
    </main>
  );
}
