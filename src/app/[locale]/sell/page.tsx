import { isFeatureEnabled } from '@/lib/features';
import { notFound } from 'next/navigation';

export default async function SellPage() {
  if (!await isFeatureEnabled('sell')) {
    return notFound();
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">Sell Your Car</h1>
      <p>This feature is coming soon.</p>
    </div>
  );
}
