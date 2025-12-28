import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const supabase = await createClient()

  // Fetch all available vehicles
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('id, updated_at')
    .eq('status', 'available')

  const vehicleEntries: MetadataRoute.Sitemap = (vehicles || []).map((vehicle) => ({
    url: `${baseUrl}/car/${vehicle.id}`,
    lastModified: new Date(vehicle.updated_at || new Date()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/buy`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/finance`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...vehicleEntries,
  ]
}
