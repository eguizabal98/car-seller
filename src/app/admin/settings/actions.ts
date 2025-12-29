'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidateTag } from 'next/cache';
import { USER_ROLES } from '@/lib/constants';

export async function toggleFeatureFlag(key: string, isEnabled: boolean) {
  const supabase = await createClient();

  // Check auth
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  // Check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== USER_ROLES.ADMIN && profile.role !== USER_ROLES.STAFF)) {
     throw new Error('Forbidden: Insufficient permissions');
  }

  const { error } = await supabase
    .from('feature_flags')
    .update({ 
        is_enabled: isEnabled,
        updated_at: new Date().toISOString(),
        updated_by: user.id
    })
    .eq('key', key);

  if (error) {
    throw new Error(`Failed to update feature flag: ${error.message}`);
  }

  revalidateTag('feature-flags');
}
