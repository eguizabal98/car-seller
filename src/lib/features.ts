import { createClient } from '@/utils/supabase/server';
import { unstable_cache } from 'next/cache';

export type FeatureFlag = {
  key: string;
  is_enabled: boolean;
  description: string;
};

export const getFeatureFlags = unstable_cache(
  async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('feature_flags').select('*');
    if (error) {
      console.error('Error fetching feature flags:', error);
      return [];
    }
    return data as FeatureFlag[];
  },
  ['feature-flags'],
  { tags: ['feature-flags'], revalidate: 3600 }
);

export async function isFeatureEnabled(key: string): Promise<boolean> {
  const flags = await getFeatureFlags();
  const flag = flags.find(f => f.key === key);
  return flag?.is_enabled ?? false;
}
