"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreatePostModal } from "@/components/modules/posts/CreatePostModal";

export function PostsPageHeader() {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Feed</h1>
          <p className="text-muted-foreground mt-2">
            Share your thoughts, experiences, and connect with other travelers
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </div>

      <CreatePostModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
    </>
  );
}
