import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function Loading() {
  return (
    <div className="container py-8">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-96" />
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <aside className="w-full lg:w-1/4 space-y-6">
          <div className="space-y-4">
             <Skeleton className="h-6 w-24" />
             <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4 rounded-sm" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                ))}
             </div>
          </div>
          <div className="space-y-4">
             <Skeleton className="h-6 w-24" />
             <Skeleton className="h-10 w-full" />
          </div>
        </aside>

        {/* Grid Skeleton */}
        <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="pt-2">
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  )
}