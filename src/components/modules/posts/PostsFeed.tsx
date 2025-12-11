import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MessageSquare } from "lucide-react";
import { getAllPosts } from "@/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/authOptions";
import { PostCard } from "@/components/modules/posts/PostCard";

interface PostsFeedProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function PostsFeed({ searchParams }: PostsFeedProps) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);

  const filters = {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 10,
    sortBy: params.sortBy as string,
    sortOrder: (params.sortOrder as "asc" | "desc" | undefined) || undefined,
    searchTerm: params.searchTerm as string,
  };

  const result = await getAllPosts(filters);

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error: {result.error}</p>
      </div>
    );
  }

  const posts = result.data || [];
  const meta = result.meta || {
    page: 1,
    limit: 10,
    total: 0,
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold">No posts yet</h3>
          <p className="text-muted-foreground">
            Be the first to share something with the community
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(meta.total / meta.limit);

  return (
    <>
      <div className="space-y-4">
        {posts.map((post: any) => {
          const isOwnPost = session?.user?.id === post.user.id;
          return <PostCard key={post.id} post={post} showActions={isOwnPost} />;
        })}
      </div>

      {meta.total > meta.limit && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={meta.page > 1 ? `?page=${meta.page - 1}` : undefined}
                className={
                  meta.page === 1 ? "pointer-events-none opacity-50" : ""
                }
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
                href={
                  meta.page < totalPages ? `?page=${meta.page + 1}` : undefined
                }
                className={
                  meta.page === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
