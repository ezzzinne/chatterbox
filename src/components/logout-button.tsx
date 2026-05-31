"use client";

import { createClient } from "@/lib/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg p-2 hover:bg-muted"
      aria-label="Logout"
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}
