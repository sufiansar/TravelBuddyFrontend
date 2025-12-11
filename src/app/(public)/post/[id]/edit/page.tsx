import { getPostById } from "@/actions";
import { EditPostForm } from "@/components/modules/posts/EditPostForm";
import { Post } from "@/types/post.interface";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const result = await getPostById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const post = result.data as Post;

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <EditPostForm post={post} />
    </div>
  );
}
