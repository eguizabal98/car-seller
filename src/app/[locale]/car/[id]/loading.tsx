import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-10 w-64 md:w-96" />
            <Skeleton className="h-6 w-48" />
        </div>
        <div className="text-left md:text-right w-full md:w-auto space-y-2">
            <Skeleton className="h-10 w-40 ml-auto" />
            <Skeleton className="h-4 w-32 ml-auto" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Media & Details */}
        <div className="lg:col-span-2 space-y-8">
            {/* Media Gallery Skeleton */}
            <div className="space-y-4">
                <Skeleton className="w-full aspect-video rounded-lg" />
                <div className="flex gap-2 overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-24 w-32 flex-shrink-0 rounded-md" />
                    ))}
                </div>
            </div>
            
            {/* Specs Grid Skeleton */}
            <div className="bg-card rounded-lg border p-6 space-y-4">
                <Skeleton className="h-7 w-48" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Description Skeleton */}
            <div className="bg-card rounded-lg border p-6 space-y-4">
                <Skeleton className="h-7 w-32" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>

            {/* Logbook Skeleton */}
            <div className="bg-card rounded-lg border p-6 space-y-4">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-10 w-full" />
                <div className="space-y-4 pt-4">
                    {[1, 2, 3].map((i) => (
                         <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            </div>
        </div>

        {/* Right Column: CTA & Logbook */}
        <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6 shadow-sm sticky top-24">
                <Skeleton className="h-7 w-48 mb-4" />
                <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <div className="grid grid-cols-2 gap-3 pt-2">
                         <Skeleton className="h-10 w-full" />
                         <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <div className="my-6 border-t" />
                {/* Finance Calculator Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}