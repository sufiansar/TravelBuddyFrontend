interface TravelPlansPaginationProps {
  meta?: { page: number; limit: number; total: number };
  onPageChange: (page: number) => void;
}

export function TravelPlansPagination({
  meta,
  onPageChange,
}: TravelPlansPaginationProps) {
  if (!meta) return null;

  const { page = 1, limit = 10, total = 0 } = meta;
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded ${
            p === page ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
