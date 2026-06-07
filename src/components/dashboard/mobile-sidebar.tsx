import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { sidebarLinks } from "./sidebar-links";
import { Route } from "next";
import LogoutButton from "../logout-button";
import { createClient } from "@/lib/server";
import { headers } from "next/headers";

export async function MobileSidebar() {
  const headerList = headers();
  const pathname = (await headerList).get("x-current-path");

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetHeader className="sr-only">
        <SheetTitle>Navigation Menu</SheetTitle>
        <SheetDescription>Navigation Menu</SheetDescription>
      </SheetHeader>

      <SheetContent side="left">
        <div className="mt-12 space-y-2 py-6">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;

            return (
              <SheetClose key={link.href} asChild>
                <Link
                  href={link.href as Route}
                  className={`link ${pathname === link.href ? "active" : ""} flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-muted`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </SheetClose>
            );
          })}
        </div>
        <div className="flex items-center justify-end gap-3 rounded-2xl border bg-background p-3">
          <div className="flex size-11 items-center justify-center rounded-full bg-muted text-sm font-semibold">
            {`${user?.user_metadata?.first_name?.[0] ?? ""}${user?.user_metadata?.last_name?.[0] ?? ""}`.toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {user?.user_metadata.full_name}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {user?.user_metadata.username}
            </p>
          </div>

          <LogoutButton />
        </div>
      </SheetContent>
    </Sheet>
  );
}
