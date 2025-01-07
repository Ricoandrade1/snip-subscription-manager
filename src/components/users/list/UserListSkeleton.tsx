import { Skeleton } from "@/components/ui/skeleton";

export function UserListSkeleton() {
  return (
    <div className="bg-barber-gray border border-barber-gray/20 rounded-lg p-6 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Skeleton className="h-5 w-5" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-4 w-36 mb-2" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-7 w-20" />
          </div>
        </div>
      </div>
      <Skeleton className="h-9 w-32" />
    </div>
  );
}