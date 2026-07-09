import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { MobileSidebar } from "./mobile-sidebar";
import { createClient } from "@/lib/server";
import Link from "next/link";
import { Route } from "next";
import { SearchInput } from "../search/search-input";
import { NotificationBell } from "../notifications/notification-bell";

export async function DashboardNavbar() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user?.id)
    .maybeSingle();

  const { data: notificationRows, error } = await supabase
    .from("notifications")
    .select("id, type, post_id, actor_id, read_at, created_at")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Notifications fetch error:", error);
  }

  const actorIds = [
    ...new Set(
      (notificationRows ?? []).map((item) => item.actor_id).filter(Boolean),
    ),
  ];

  const postIds = [
    ...new Set(
      (notificationRows ?? []).map((item) => item.post_id).filter(Boolean),
    ),
  ];

  const { data: actors } =
    actorIds.length > 0
      ? await supabase
          .from("profiles")
          .select("id, name, first_name, last_name, username, avatar_url")
          .in("id", actorIds)
      : { data: [] };

  const { data: posts } =
    postIds.length > 0
      ? await supabase.from("posts").select("id, title").in("id", postIds)
      : { data: [] };

  const actorsById = new Map((actors ?? []).map((actor) => [actor.id, actor]));
  const postsById = new Map((posts ?? []).map((post) => [post.id, post]));

  const notifications =
    notificationRows?.map((notification) => ({
      id: notification.id,
      type: notification.type,
      post_id: notification.post_id,
      read_at: notification.read_at,
      created_at: notification.created_at,
      actor: notification.actor_id
        ? (actorsById.get(notification.actor_id) ?? null)
        : null,
      post: notification.post_id
        ? (postsById.get(notification.post_id) ?? null)
        : null,
    })) ?? [];

  return (
    <>
      {/* Mobile */}
      <header className="sticky top-0 z-50 border-b bg-background lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <MobileSidebar />

            <Link href={"/"}>
              <h1 className="font-bold">Chatterbox</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <NotificationBell initialNotifications={notifications} />
            </Button>

            <Link href={"/dashboard/posts/new" as Route}>
              <Button size="sm">
                <Plus />
                New
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Desktop */}
      <header className="sticky top-0 z-40 hidden border-b bg-background lg:block">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="w-full max-w-md">
            <SearchInput />
          </div>

          <div className="flex items-center gap-3">
            <Link href={"/dashboard/posts/new" as Route}>
              <Button>
                <Plus />
                New Article
              </Button>
            </Link>

            <Button variant="outline" size="icon">
              <NotificationBell initialNotifications={notifications} />
            </Button>

            {profile?.username ? (
              <Link href={`/dashboard/users/${profile.username}` as Route}>
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.avatar_url ?? ""} />

                  <AvatarFallback>
                    {`${user?.user_metadata?.first_name?.[0] ?? ""}${
                      user?.user_metadata?.last_name?.[0] ?? ""
                    }`.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Avatar>
                <AvatarImage src={user?.user_metadata?.avatar_url ?? ""} />

                <AvatarFallback>
                  {`${user?.user_metadata?.first_name?.[0] ?? ""}${
                    user?.user_metadata?.last_name?.[0] ?? ""
                  }`.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
