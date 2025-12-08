import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

interface TravelPlansPaginationProps {
  meta: PaginationMeta;
}

export function TravelPlansPagination({ meta }: TravelPlansPaginationProps) {
  const totalPages = Math.ceil(meta.total / meta.limit);

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={meta.page > 1 ? `?page=${meta.page - 1}` : undefined}
            className={meta.page === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum;

          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (meta.page <= 3) {
            pageNum = i + 1;
          } else if (meta.page >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = meta.page - 2 + i;
          }

          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href={`?page=${pageNum}`}
                isActive={meta.page === pageNum}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {totalPages > 5 && meta.page < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            href={meta.page < totalPages ? `?page=${meta.page + 1}` : undefined}
            className={
              meta.page === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
