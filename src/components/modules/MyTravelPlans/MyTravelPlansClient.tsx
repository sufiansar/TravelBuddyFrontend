// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Trash2, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { deleteTravelPlan } from "@/actions";

// export function MyTravelPlansClient({ planId }: { planId: string }) {
//   const [isDeleting, setIsDeleting] = useState(false);

//   const handleDelete = async () => {
//     setIsDeleting(true);
//     try {
//       const result = await deleteTravelPlan(planId);
//       if (result.success) {
//         toast.success("Travel plan deleted successfully");
//         // Optionally trigger a refresh or redirect
//         window.location.reload();
//       } else {
//         toast.error(result.error || "Failed to delete plan");
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to delete plan");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <AlertDialog>
//       <AlertDialogTrigger asChild>
//         <Button variant="destructive" size="sm" className="gap-1">
//           <Trash2 className="h-4 w-4" />
//           Delete
//         </Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Delete Travel Plan?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This action cannot be undone. This will permanently delete your
//             travel plan and all associated data.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <div className="flex gap-2 justify-end">
//           <AlertDialogCancel>Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             onClick={handleDelete}
//             disabled={isDeleting}
//             className="bg-destructive hover:bg-destructive/90"
//           >
//             {isDeleting ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Deleting...
//               </>
//             ) : (
//               "Delete"
//             )}
//           </AlertDialogAction>
//         </div>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }
