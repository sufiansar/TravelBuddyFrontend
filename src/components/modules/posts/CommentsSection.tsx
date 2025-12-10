"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Send,
  MoreVertical,
  Edit,
  Trash2,
  Loader2,
  BadgeCheck,
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { PostComment } from "@/types/post.interface";
import { createComment, deleteComment, updateComment } from "@/actions";

interface CommentsSectionProps {
  postId: string;
  comments: PostComment[];
  onCommentsUpdate?: () => void;
}

export function CommentsSection({
  postId,
  comments,
  onCommentsUpdate,
}: CommentsSectionProps) {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<PostComment | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmitComment = () => {
    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    if (!session) {
      toast.error("Please login to comment");
      return;
    }

    console.log("Submitting comment:", {
      postId,
      content: newComment,
      session: session?.user,
    });

    setError("");
    startTransition(async () => {
      if (editingComment) {
        console.log("Updating comment:", editingComment.id);
        const result = await updateComment(editingComment.id, newComment);
        console.log("Update comment result:", result);
        if (result.success) {
          toast.success("Comment updated");
          setNewComment("");
          setEditingComment(null);
          onCommentsUpdate?.();
        } else {
          setError(result.error || "Failed to update comment");
          toast.error(result.error || "Failed to update comment");
        }
      } else {
        console.log("Creating new comment for post:", postId);
        const result = await createComment(postId, newComment);
        console.log("Create comment result:", result);
        if (result.success) {
          toast.success("Comment added");
          setNewComment("");
          onCommentsUpdate?.();
        } else {
          console.error("Failed to create comment:", result.error);
          setError(result.error || "Failed to add comment");
          toast.error(result.error || "Failed to add comment");
        }
      }
    });
  };

  const handleEditComment = (comment: PostComment) => {
    setEditingComment(comment);
    setNewComment(comment.content);
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!commentToDelete) return;

    startTransition(async () => {
      const result = await deleteComment(commentToDelete);
      if (result.success) {
        toast.success("Comment deleted");
        onCommentsUpdate?.();
      } else {
        toast.error(result.error || "Failed to delete comment");
      }
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    });
  };

  const currentUserId = session?.user?.id;

  console.log("CommentsSection - Session:", session);
  console.log("CommentsSection - PostId:", postId);
  console.log("CommentsSection - Comments count:", comments.length);

  return (
    <div className="space-y-4">
      {/* Add Comment Form */}
      <Card>
        <CardContent className="p-4">
          {!session && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please login to comment on this post.
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-3">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
                setError("");
              }}
              className="min-h-20 resize-none"
              disabled={isPending}
            />
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex justify-end">
              {editingComment && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingComment(null);
                    setNewComment("");
                  }}
                  disabled={isPending}
                  className="mr-2"
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleSubmitComment}
                disabled={isPending || !newComment.trim()}
                className="gap-2"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {editingComment ? "Update" : "Comment"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="flex gap-3 pb-4 border-b last:border-0 last:pb-0"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user.profileImage} />
                  <AvatarFallback>
                    {comment.user.fullName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-semibold flex items-center gap-1">
                        {comment.user.fullName}
                        {comment.user?.verifiedBadge && (
                          <BadgeCheck className="h-4 w-4 text-blue-500" />
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                      </span>
                      {comment.updatedAt !== comment.createdAt && (
                        <span className="text-xs text-muted-foreground ml-2">
                          (edited)
                        </span>
                      )}
                    </div>
                    {currentUserId === comment.userId && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditComment(comment)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
