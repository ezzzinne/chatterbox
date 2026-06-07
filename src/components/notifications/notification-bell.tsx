"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useState } from "react";
import type { Route } from "next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { markNotificationAsReadAction } from "@/actions/notifications";

type Notification = {
  id: string;
  type: "like" | "comment" | "reply" | "follow";
  post_id: string | null;
  read_at: string | null;
  created_at: string;
  actor: {
    id: string;
    name: string | null;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
  post: {
    id: string;
    title: string;
  } | null;
};

type Props = {
  initialNotifications: Notification[];
};

function getActorName(actor: Notification["actor"]) {
  if (!actor) return "Someone";

  const fullName = `${actor.first_name ?? ""} ${actor.last_name ?? ""}`.trim();

  return actor.name || fullName || actor.username || "Someone";
}

function getNotificationText(notification: Notification) {
  const actorName = getActorName(notification.actor);

  if (notification.type === "like") {
    return `${actorName} liked your post`;
  }

  if (notification.type === "comment") {
    return `${actorName} commented on your post`;
  }

  if (notification.type === "reply") {
    return `${actorName} replied to your comment`;
  }

  if (notification.type === "follow") {
    return `${actorName} followed you`;
  }

  return "You have a new notification";
}

export function NotificationBell({ initialNotifications }: Props) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(
    (notification) => !notification.read_at,
  ).length;

  const handleNotificationClick = async (notificationId: string) => {
    await markNotificationAsReadAction(notificationId);

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read_at: new Date().toISOString() }
          : notification,
      ),
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute right-1 top-0 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] text-xxs text-muted-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              No notifications yet.
            </p>
          ) : (
            notifications.map((notification) => (
              <Link
                key={notification.id}
                href={
                  notification.post_id
                    ? (`/dashboard/articles/${notification.post_id}` as Route)
                    : notification.actor?.username
                      ? (`/dashboard/users/${notification.actor.username}` as Route)
                      : ("/dashboard" as Route)
                }
                onClick={() => handleNotificationClick(notification.id)}
                className={`block border-t p-4 text-sm transition hover:bg-muted ${
                  notification.read_at ? "opacity-60" : ""
                }`}
              >
                <p className="font-medium">
                  {getNotificationText(notification)}
                </p>

                {notification.post?.title && (
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {notification.post.title}
                  </p>
                )}

                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </Link>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
