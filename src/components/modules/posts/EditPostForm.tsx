"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updatePost } from "@/actions";
import { Post } from "@/types/post.interface";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ImagePlus, Loader2, X } from "lucide-react";

interface EditPostFormProps {
  post: Post;
}

export function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(post.content || "");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  useEffect(() => {

    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (newImages.length + files.length > 10) {
      toast.error("Maximum 10 new images allowed");
      return;
    }

    const updated = [...newImages, ...files];
    setNewImages(updated);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeNewImage = (index: number) => {
    setNewImages((imgs) => imgs.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!content.trim() && newImages.length === 0) {
      setError("Please add content or images");
      return;
    }

    setError("");
    startTransition(async () => {
      const result = await updatePost(post.id, {
        content,
        images: newImages,
      });

      if (result.success) {
        toast.success("Post updated successfully");
        router.push(`/post/${post.id}`);
        router.refresh();
      } else {
        setError(result.error || "Failed to update post");
      }
    });
  };

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Update your post content and optionally add new images.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Textarea
            placeholder="Update your post content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] resize-none"
            disabled={isPending}
          />

          {post.images?.length ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Existing images</p>
              <div className="grid grid-cols-3 gap-2">
                {post.images.map((img, index) => (
                  <div
                    key={`${img}-${index}`}
                    className="relative aspect-square overflow-hidden rounded-lg border"
                  >
                    <Image
                      src={img}
                      alt={`Existing image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {imagePreviews.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">New images</p>
              <div className="grid grid-cols-3 gap-2">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={preview}
                    className="relative aspect-square rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <input
              type="file"
              id="edit-post-images"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
              disabled={isPending || newImages.length >= 10}
            />
            <label htmlFor="edit-post-images">
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                disabled={isPending || newImages.length >= 10}
                asChild
              >
                <div>
                  <ImagePlus className="h-4 w-4" />
                  Add Photos ({newImages.length}/10)
                </div>
              </Button>
            </label>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
