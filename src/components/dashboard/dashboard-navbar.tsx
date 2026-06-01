import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { MobileSidebar } from "./mobile-sidebar";
import { createClient } from "@/lib/server";

export async function DashboardNavbar() {
      const supabase = await createClient();

    const {
  data: { user },
} = await supabase.auth.getUser();

  return (
    <>
      {/* Mobile */}
      <header className="sticky top-0 z-50 border-b bg-background lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <MobileSidebar />

            <h1 className="font-bold">
              Chatterbox
            </h1>
          </div>

          <Button size="sm">
            Create
          </Button>
        </div>
      </header>

      {/* Desktop */}
      <header className="sticky top-0 z-40 hidden border-b bg-background lg:block">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="w-full max-w-md">
            <input
              placeholder="Search posts, writers, tags..."
              className="h-10 w-full rounded-xl border px-4"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button>
              Create Post
            </Button>

            <Button
              variant="outline"
              size="icon"
            >
              <Bell />
            </Button>

            <Avatar>
                <AvatarImage src={user?.user_metadata.avatar_url} />

              <AvatarFallback>
                {user?.user_metadata.first_name?.[0]?.toUpperCase() + user?.user_metadata.last_name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
    </>
  );
}