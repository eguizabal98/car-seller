import { FeaturedCars } from "@/components/home/featured-cars";
import { Hero } from "@/components/home/hero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeaturedCars />
    </div>
  );
}
