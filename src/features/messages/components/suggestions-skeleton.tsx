import { Skeleton } from "@/components/ui/skeleton";

interface SuggestionsSkeletonProps {
  amount?: number;
}

export function SuggestionsSkeleton({ amount = 4 }: SuggestionsSkeletonProps) {
  return (
    <div className="flex flex-col space-y-4 w-full mt-5">
      {Array.from({ length: amount }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
