import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { Database } from '@/types/supabase';

export type FeatureFlag = Database['public']['Tables']['feature_flags']['Row'];

export const getFeatureFlags = unstable_cache(
  async () => {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase.from('feature_flags').select('*');
    if (error) {
      console.error('Error fetching feature flags:', error);
      return [];
    }
    return data;
  },
  ['feature-flags'],
  { tags: ['feature-flags'], revalidate: 3600 }
);

export async function isFeatureEnabled(key: string): Promise<boolean> {
  const flags = await getFeatureFlags();
  const flag = flags.find(f => f.key === key);
  return flag?.is_enabled ?? false;
}
