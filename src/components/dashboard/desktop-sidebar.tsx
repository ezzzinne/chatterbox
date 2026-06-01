import Link from "next/link";
import { sidebarLinks } from "./sidebar-links";
import { Route } from "next";
import { createClient } from "@/lib/server";
import { headers } from "next/headers";
import LogoutButton from "../logout-button";

export default async function DesktopSidebar() {
  const headerList = headers();
  const pathname = (await headerList).get("x-current-path");

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <aside className="hidden w-72 border-r bg-muted/30 lg:flex lg:flex-col">
        <div className="border-b px-6 py-5">
          <h1 className="text-2xl font-bold tracking-tight">Chatterbox</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Publish. Discover. Analyze.
          </p>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href as Route}
                className={`link ${pathname === "/" ? "active" : ""} flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium hover:bg-background`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 rounded-2xl border bg-background p-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-muted text-sm font-semibold">
            {user?.user_metadata.first_name?.[0]?.toUpperCase() + user?.user_metadata.last_name?.[0]?.toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {user?.user_metadata.full_name}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              @{user?.user_metadata.username}
            </p>
          </div>

          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
