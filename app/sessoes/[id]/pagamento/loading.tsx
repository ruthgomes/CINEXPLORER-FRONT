import { Skeleton } from "@/components/ui/skeleton"

export default function PaymentLoading() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-8 w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg p-6 space-y-6">
            <Skeleton className="h-8 w-64 mb-4" />
            <div className="space-y-4">
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 flex-1" />
                ))}
              </div>
              <Skeleton className="h-40 w-full" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>

        <div>
          <div className="border rounded-lg p-6 space-y-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="flex items-start gap-4">
              <Skeleton className="h-20 w-14 rounded" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-4">
              <Skeleton className="h-5 w-40" />
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
              <div className="pt-4 border-t flex items-center justify-between">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-7 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
