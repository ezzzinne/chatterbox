"use client";

import { createClient } from "@/lib/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="rounded-lg p-2 hover:bg-muted" aria-label="Logout">
          <LogOut className="h-4 w-4" />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-[calc(100vw-2rem)] sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Logout</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to log out? You will need to sign in again to
            access your dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleLogout}
            className="bg-destructive text-white"
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
