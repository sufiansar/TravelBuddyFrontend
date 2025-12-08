"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, AlertCircle } from "lucide-react";

import { toast } from "sonner";
import { updateUserRole } from "@/actions";

interface RoleUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  currentRole: string;
  userName: string;
  onSuccess?: () => void;
}

export function RoleUpdateModal({
  open,
  onOpenChange,
  userId,
  currentRole,
  userName,
  onSuccess,
}: RoleUpdateModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>(currentRole);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleUpdateRole = () => {
    if (!selectedRole || selectedRole === currentRole) {
      setError("Please select a different role");
      return;
    }

    setError("");
    startTransition(async () => {
      const result = await updateUserRole(userId, selectedRole as any);
      if (result.success) {
        toast.success(`Role updated to ${selectedRole.replace("_", " ")}`);
        onSuccess?.();
        onOpenChange(false);
      } else {
        setError(result.error || "Failed to update role");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Update User Role
          </DialogTitle>
          <DialogDescription>Update role for {userName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Role</label>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <Shield className="h-4 w-4" />
              <span className="font-medium capitalize">
                {currentRole.toLowerCase().replace("_", " ")}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Role</label>
            <Select
              value={selectedRole}
              onValueChange={(value) => {
                setSelectedRole(value);
                setError("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateRole}
            disabled={isPending || selectedRole === currentRole}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Role"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
