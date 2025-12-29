import { FeaturedCars } from "@/components/home/featured-cars";
import { Hero } from "@/components/home/hero";
import { createClient } from "@/utils/supabase/server";
import { Car } from "@/components/inventory/car-card";

export default async function Home() {
  const supabase = await createClient();

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*, media(url, is_primary)")
    .eq("is_featured", true)
    .limit(6);

  // Transform data to match Car interface
  const cars: Car[] = (vehicles || []).map((v: any) => {
    // Find primary image or use first image or placeholder
    const primaryMedia = v.media?.find((m: any) => m.is_primary) || v.media?.[0];
    const imageUrl = primaryMedia?.url || 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20car%20placeholder%20studio%20lighting&image_size=landscape_4_3';

    return {
      id: v.id,
      make: v.make,
      model: v.model,
      year: v.year,
      price: v.price,
      mileage: v.mileage,
      fuel_type: v.fuel_type,
      image: imageUrl,
      status: v.status.charAt(0).toUpperCase() + v.status.slice(1), // Capitalize for UI
    };
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeaturedCars cars={cars} />
    </div>
  );
}
