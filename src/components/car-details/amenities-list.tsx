
import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function AmenitiesList({ amenities }: { amenities: string[] }) {
  if (!amenities || amenities.length === 0) {
    return null
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-xl font-semibold mb-4">Features & Amenities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
        {amenities.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="bg-primary/10 p-1 rounded-full">
                <Check className="h-3 w-3 text-primary" />
            </div>
            <span className="text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
